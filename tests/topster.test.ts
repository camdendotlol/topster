import { createCanvas } from 'canvas'
import makeNodeChart from '../src/node'
import sampleChart from './sample_chart'
import fs from 'fs'
import path from 'path'
import { checkIfFileExists } from './testHelper'
import { promisify } from 'util'

// Not sure how to test the browser chart generator from here.
// The test suite would need to be able to provide an HTML Canvas
// element and HTML img elements. 🤔

// test('produces identical charts between node and browser', () => {
// TODO
// })

const filePath = path.join(__dirname, 'chart.jpg')
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

beforeAll(async () => {
  const canvas = createCanvas(0, 0)
  const chart = await makeNodeChart(canvas, sampleChart)

  const buffer = chart.toBuffer('image/jpeg')

  await writeFile(filePath, buffer)
})

test('generates a chart successfully', async () => {
  expect(checkIfFileExists(filePath)).toBe(true)
})

afterAll(async () => {
  // Delete chart.jpg when the tests are done.
  await unlink(filePath)
})
