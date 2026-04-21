import { useEffect } from "react"
import mermaid from "mermaid"

const useMermaidEffect = () => {
  useEffect(() => {
    const elements = document.getElementsByClassName("language-mermaid")
    if (!elements.length) return

    for (let i = 0; i < elements.length; i++) {
      const container = document.createElement('div')
      container.id = "mermaid" + i
      container.style.display = "none"
      document.body.appendChild(container)

      mermaid.render(
        container.id,
        elements[i].textContent || "",
      ).then(({ svg }) => {
        elements[i].innerHTML = svg
      }).catch(() => {}).finally(() => {
        container.remove()
      })
    }
  }, [])
}

export default useMermaidEffect
