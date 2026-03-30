/** @type {import('next').NextConfig} */
const outputMode =
    process.env.NEXT_OUTPUT_MODE === "export" ? "export" : undefined

const nextConfig = {
    output: outputMode,
}

export default nextConfig
