export default function timoutAsync(timeoutSeconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutSeconds * 1000)
  })
}
