import { readFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

const LOCAL_CONTENT_ROOT = path.join(process.cwd(), "content-sample")

function getContentType(filePath: string) {
    if (filePath.endsWith(".json")) {
        return "application/json; charset=utf-8"
    }

    if (filePath.endsWith(".md")) {
        return "text/markdown; charset=utf-8"
    }

    if (filePath.endsWith(".pdf")) {
        return "application/pdf"
    }

    return "application/octet-stream"
}

export async function GET(
    _request: Request,
    context: {
        params: Promise<{
            path: string[]
        }>
    }
) {
    if (process.env.NODE_ENV !== "development") {
        return new NextResponse("Not found", { status: 404 })
    }

    const { path: pathSegments } = await context.params
    const relativePath = pathSegments.join("/")
    const resolvedPath = path.resolve(LOCAL_CONTENT_ROOT, relativePath)

    if (!resolvedPath.startsWith(LOCAL_CONTENT_ROOT)) {
        return new NextResponse("Invalid path", { status: 400 })
    }

    try {
        const fileBuffer = await readFile(resolvedPath)

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": getContentType(resolvedPath),
                "Cache-Control": "no-store",
            },
        })
    } catch {
        return new NextResponse("Not found", { status: 404 })
    }
}
