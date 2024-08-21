interface Logger {
  info: (...params: unknown[]) => void
  error: (...params: unknown[]) => void
}

const log = (level: "info" | "error", ...params: unknown[]) => {
  if (process.env.NODE_ENV !== "test") {
    if (level === "info") {
      console.log(...params)
    } else if (level === "error") {
      console.error(...params)
    }
  }
}

const logger: Logger = {
  info: (...params: unknown[]) => log("info", ...params),
  error: (...params: unknown[]) => log("error", ...params)
}

export default logger
