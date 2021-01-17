import fs from 'fs'
import demofile from 'demofile'

fs.readFile(process.argv[2], async (err, buffer) => {
	const demoFile = new demofile.DemoFile()

	let map = null
	const bombsiteCenters = {}
	const bombsites = {}

	const vectorInside = (v, min, max) => {
		return v.x >= min.x && v.x <= max.x
			&& v.y >= min.y && v.y <= max.y
			&& v.z >= min.z && v.z <= max.z
	}

	const bombsiteData = (siteIndex) => {
		const entity = demoFile.entities.entities[siteIndex]
		const min = entity.getProp('DT_CollisionProperty', 'm_vecMins')
		const max = entity.getProp('DT_CollisionProperty', 'm_vecMaxs')

		if (bombsiteCenters.a && vectorInside(bombsiteCenters.a, min, max)) return {
			name: 'a',
			vectors: [
				bombsiteCenters.a,
				{ x: Math.round(min.x), y: Math.round(min.y), z: Math.round(min.z) },
				{ x: Math.round(max.x), y: Math.round(max.y), z: Math.round(max.z) },
			],
		}

		if (bombsiteCenters.b && vectorInside(bombsiteCenters.b, min, max)) return {
			name: 'b',
			vectors: [
				bombsiteCenters.b,
				{ x: Math.round(min.x), y: Math.round(min.y), z: Math.round(min.z) },
				{ x: Math.round(max.x), y: Math.round(max.y), z: Math.round(max.z) },
			],
		}

		throw 'cannot find bombsite'
	}

	demoFile.on('start', () => {
		map = demoFile.header.mapName
	})

	demoFile.gameEvents.on('bomb_planted', (e) => {
		const data = bombsiteData(e.site)

		bombsites[data.name] = data.vectors

		if (bombsites.hasOwnProperty('a') && bombsites.hasOwnProperty('b')) {
			console.log(map + ':', bombsites)
			return demoFile.cancel()
		}
	})

	demoFile.entities.on('change', (e) => {
		if (e.tableName !== 'DT_CSPlayerResource') return

		if (e.varName === 'm_bombsiteCenterA') bombsiteCenters.a = e.newValue
		else if (e.varName === 'm_bombsiteCenterB') bombsiteCenters.b = e.newValue
	})

	demoFile.parse(buffer)

	demoFile.on('end', (e) => {
		console.log(map + ':', bombsites)
	})
})
