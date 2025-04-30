import { useEffect } from "react"
import mermaid from "mermaid"

const useMermaidEffect = () => {
  useEffect(() => {
    const elements = document.getElementsByClassName("language-mermaid")

    for (let i = 0; i < elements.length; i++) {
      const container = document.createElement('div')
      container.id = "mermaid" + i

      mermaid.render(
        container.id,
        elements[i].textContent || "",
        container
      ).then(({ svg }) => {
        elements[i].innerHTML = svg
      })
    }
  }, [])

  return
}

export default useMermaidEffect
