import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    const originalName = (file.name || '').toLowerCase()
    const isXlsx = originalName.endsWith('.xlsx')
    const isXls = originalName.endsWith('.xls')
    if (!isXlsx && !isXls) {
      return NextResponse.json({ error: 'Only .xlsx/.xls files are supported' }, { status: 400 })
    }

    const projectId = originalName.replace(/\.(xlsx|xls)$/i, '')

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const inputDir = process.env.HYDROBOOST_INPUT_DIR
      || path.resolve(process.cwd(), '..', '..', 'BACKEND', 'Input_Spreadsheets')

    await fs.mkdir(inputDir, { recursive: true })

    const outPath = path.join(inputDir, `${projectId}.xlsx`)
    await fs.writeFile(outPath, buffer)

    return NextResponse.json({ ok: true, projectId, savedPath: outPath })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}


