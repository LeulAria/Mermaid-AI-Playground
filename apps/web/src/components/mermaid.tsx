import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import createPanZoom from "panzoom";
import { IconButton, Box } from "@mui/material";

export interface MermaidProps {
  text: string;
  previewMode?: boolean;
  onError?: (hasError: boolean, errorMessage?: string) => void;
}

export const Mermaid: React.FC<MermaidProps> = ({
  text,
  previewMode = false,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const panzoomInstanceRef = useRef<ReturnType<typeof createPanZoom> | null>(
    null
  );
  const hasInitializedZoom = useRef(false);
  const previousTransformRef = useRef<{
    x: number;
    y: number;
    scale: number;
  } | null>(null);
  const [isPanzoomReady, setIsPanzoomReady] = useState(false);

  useEffect(() => {
    if (!isInitialized.current) {
      mermaid.initialize({
        suppressErrorRendering: true,
        startOnLoad: false,
        securityLevel: "loose",
        theme: "dark",
        flowchart: {
          curve: "linear",
        },
        themeVariables: {
          // Font
          fontFamily: '"Geist Mono", "Geist", ui-monospace, monospace',

          // Background - ChatGPT-like dark background
          background: "#1D1D1D",
          primaryColor: "rgba(68, 68, 68, 0.5)",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#555555",

          // Secondary elements - Subtle professional colors
          secondaryColor: "rgba(68, 68, 68, 0.5)",
          secondaryTextColor: "#ffffff",
          secondaryBorderColor: "#555555",

          // Tertiary elements
          tertiaryColor: "rgba(68, 68, 68, 0.5)",
          tertiaryTextColor: "#ffffff",
          tertiaryBorderColor: "#555555",

          // Text and labels - Clean and readable
          textColor: "#ffffff",
          labelTextColor: "#e5e5e5",
          lineColor: "#666666",

          // Flowchart specific - ChatGPT-style clean boxes
          mainBkg: "rgba(68, 68, 68, 0.5)",
          secondBkg: "rgba(74, 74, 74, 0.5)",
          tertiaryBkg: "rgba(80, 80, 80, 0.5)",

          // Borders and edges - Subtle darker borders
          border1: "#555555",
          border2: "#555555",
          border3: "#555555",
          arrowheadColor: "#999999",
          clusterBkg: "rgba(68, 68, 68, 0.3)",
          clusterBorder: "#999999",

          // Sequence diagram - ChatGPT-style clean
          actorBkg: "rgba(68, 68, 68, 0.5)",
          actorBorder: "#555555",
          actorTextColor: "#ffffff",
          actorLineColor: "#555555",
          signalColor: "#ffffff",
          signalTextColor: "#e5e5e5",
          labelBoxBkgColor: "rgba(68, 68, 68, 0.5)",
          labelBoxBorderColor: "#555555",
          loopTextColor: "#e5e5e5",
          activationBorderColor: "#555555",
          activationBkgColor: "rgba(68, 68, 68, 0.6)",

          // State diagram - Professional minimal style
          stateBkg: "rgba(68, 68, 68, 0.5)",
          stateBorder: "#555555",
          labelColor: "#ffffff",
          edgeLabelBackground: "rgba(68, 68, 68, 0.5)",
          stateTextColor: "#ffffff",
          stateLabelBg: "rgba(68, 68, 68, 0.5)",

          // Class diagram
          classText: "#ffffff",

          // Notes - Subtle background with opacity
          noteBkgColor: "rgba(68, 68, 68, 0.5)",
          noteTextColor: "#e5e5e5",
          noteBorderColor: "#555555",

          // Gantt - Professional ChatGPT-style timeline
          sectionBkgColor: "rgba(68, 68, 68, 0.3)",
          altSectionBkgColor: "rgba(68, 68, 68, 0.2)",
          sectionBkgColor2: "rgba(74, 74, 74, 0.3)",
          excludeBkgColor: "rgba(33, 33, 33, 0.5)",
          taskBorderColor: "#555555",
          taskTextColor: "#ffffff",
          taskTextLightColor: "#e5e5e5",
          taskTextOutsideColor: "#e5e5e5",
          taskTextClickableColor: "rgba(255, 255, 255, 0.8)",
          activeTaskBorderColor: "#555555",
          activeTaskBkgColor: "rgba(68, 68, 68, 0.6)",
          gridColor: "#666666",
          doneTaskBkgColor: "rgba(68, 68, 68, 0.5)",
          doneTaskBorderColor: "#555555",
          critBorderColor: "#ff4444",
          critBkgColor: "#3d1a1a",
          todayLineColor: "#ff4444",

          // Pie - Azure color palette with opacity (more opaque)
          pie1: "rgba(0, 120, 212, 0.8)",
          pie2: "rgba(16, 137, 62, 0.8)",
          pie3: "rgba(255, 170, 68, 0.8)",
          pie4: "rgba(136, 23, 152, 0.8)",
          pie5: "rgba(0, 188, 242, 0.8)",
          pie6: "rgba(255, 107, 107, 0.8)",
          pie7: "rgba(80, 200, 120, 0.8)",
          pieOpacity: 0.9,
          pieTitleTextSize: "12px",
          pieTitleTextColor: "#ffffff",
          pieSectionTextSize: "12px",
          pieSectionTextColor: "#ffffff",
          pieLegendTextSize: "11px",
          pieLegendTextColor: "#cccccc",
          pieStrokeColor: "#1D1D1D",
          pieStrokeWidth: "2",

          // Journey - Professional ChatGPT-style
          journeyTaskBkgColor: "rgba(68, 68, 68, 0.5)",
          journeyTaskTextColor: "#ffffff",
          journeyTaskBorderColor: "#555555",

          // ER Diagram - Professional style
          erDbBgColor: "rgba(68, 68, 68, 0.5)",
          erDbBorderColor: "#555555",
          erEntityBoxColor: "rgba(68, 68, 68, 0.5)",
          erEntityBorderColor: "#555555",
          erAttributeBoxColor: "rgba(68, 68, 68, 0.6)",
          erAttributeBorderColor: "#555555",
          erRelationshipLineColor: "#999999",
          erRelationshipLabelColor: "#ffffff",
          erRelationshipLabelBg: "rgba(68, 68, 68, 0.7)",
          erCardinalityBoxColor: "rgba(68, 68, 68, 0.7)",

          // Gitgraph
          git0: "#0078d4",
          git1: "#10893e",
          git2: "#ffaa44",
          git3: "#881798",
          git4: "#00bcf2",
          git5: "#ff6b6b",
          git6: "#50c878",
          git7: "#a0a0a0",
        },
        logLevel: "error",
      });
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current || !text.trim()) {
        return;
      }

      try {
        // Save current transform before clearing (if zoom has been initialized)
        if (panzoomInstanceRef.current && hasInitializedZoom.current) {
          try {
            previousTransformRef.current =
              panzoomInstanceRef.current.getTransform();
          } catch (e) {
            // Ignore errors getting transform
          }
        }

        // Clear previous content and dispose of panzoom instance
        if (panzoomInstanceRef.current) {
          panzoomInstanceRef.current.dispose();
          panzoomInstanceRef.current = null;
          setIsPanzoomReady(false);
        }
        containerRef.current.innerHTML = "";

        // Generate a unique ID for this render
        const id = `mermaid-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 11)}`;

        // Render the diagram - wrap in Promise to catch all errors
        let svg: string;
        try {
          const result = await mermaid.render(id, text);
          svg = result.svg;

          // Check if Mermaid rendered an error SVG - only check for actual error indicators
          if (
            !svg ||
            (svg.includes('class="error-icon"') &&
              svg.includes('class="error-text"')) ||
            (svg.includes("Syntax error in text") &&
              svg.includes("mermaid version"))
          ) {
            // Mermaid rendered an error - throw to prevent displaying it
            throw new Error(
              "Invalid diagram syntax. Please check your Mermaid code."
            );
          }
        } catch (renderError: any) {
          // Extract error message safely to avoid circular reference issues
          let errorMsg = "Invalid Mermaid syntax";

          // Safely extract error message without accessing circular properties
          try {
            if (renderError?.message) {
              const msg = renderError.message;
              // Check for circular reference error
              if (
                msg.includes("circular structure") ||
                msg.includes("circular") ||
                msg.includes("JSON")
              ) {
                errorMsg =
                  "Diagram rendering error. Please check your Mermaid syntax.";
              } else {
                // Filter out generic "Syntax error in text mermaid version" messages
                const isGenericError =
                  msg.includes("Syntax error in text") &&
                  msg.includes("mermaid version");

                if (!isGenericError) {
                  // Use the error message if it's not the generic one
                  errorMsg = msg;
                } else {
                  // Extract parse error details if available
                  if (msg.includes("Parse error")) {
                    const parseMatch = msg.match(/Parse error[^:]*:\s*(.+)/);
                    errorMsg = parseMatch
                      ? parseMatch[1].trim()
                      : "Parse error in diagram syntax";
                  } else if (
                    renderError?.str &&
                    typeof renderError.str === "string"
                  ) {
                    errorMsg = `Syntax error: ${renderError.str}`;
                  } else {
                    errorMsg =
                      "Invalid diagram syntax. Please check your Mermaid code.";
                  }
                }
              }
            } else if (typeof renderError === "string") {
              if (
                renderError.includes("circular structure") ||
                renderError.includes("circular") ||
                renderError.includes("JSON")
              ) {
                errorMsg =
                  "Diagram rendering error. Please check your Mermaid syntax.";
              } else {
                const isGenericError =
                  renderError.includes("Syntax error in text") &&
                  renderError.includes("mermaid version");
                if (!isGenericError) {
                  errorMsg = renderError;
                } else {
                  errorMsg =
                    "Invalid diagram syntax. Please check your Mermaid code.";
                }
              }
            }
          } catch (e) {
            // If we can't extract error safely, use generic message
            errorMsg =
              "Invalid diagram syntax. Please check your Mermaid code.";
          }

          throw new Error(errorMsg);
        }

        if (containerRef.current && svg) {
          // Check if SVG contains Mermaid error rendering - only if both error classes are present
          if (
            svg.includes('class="error-icon"') &&
            svg.includes('class="error-text"')
          ) {
            // Mermaid rendered an error SVG - don't display it, show our custom error instead
            if (containerRef.current) {
              containerRef.current.innerHTML = "";
            }
            throw new Error(
              "Invalid diagram syntax. Please check your Mermaid code."
            );
          }

          containerRef.current.innerHTML = svg;

          // Notify parent component that there's no error
          if (onError) {
            onError(false);
          }

          // Apply font family and weight to all text elements in the SVG, and set background
          setTimeout(() => {
            const svgElement = containerRef.current?.querySelector(
              "svg"
            ) as SVGSVGElement;

            if (svgElement) {
              // Set SVG background color - ChatGPT-like
              svgElement.style.backgroundColor = "#1D1D1D";

              // Add drop-shadow filter definition for boxes
              let defs = svgElement.querySelector("defs");
              if (!defs) {
                defs = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "defs"
                );
                svgElement.insertBefore(defs, svgElement.firstChild);
              }

              // Check if shadow filter already exists
              let shadowFilter = defs.querySelector("#box-shadow-filter");
              if (!shadowFilter) {
                shadowFilter = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "filter"
                );
                shadowFilter.setAttribute("id", "box-shadow-filter");
                shadowFilter.setAttribute("x", "-50%");
                shadowFilter.setAttribute("y", "-50%");
                shadowFilter.setAttribute("width", "200%");
                shadowFilter.setAttribute("height", "200%");

                // Create drop shadow
                const feOffset = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "feOffset"
                );
                feOffset.setAttribute("in", "SourceAlpha");
                feOffset.setAttribute("dx", "2");
                feOffset.setAttribute("dy", "2");
                feOffset.setAttribute("result", "offset");

                const feGaussianBlur = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "feGaussianBlur"
                );
                feGaussianBlur.setAttribute("in", "offset");
                feGaussianBlur.setAttribute("stdDeviation", "3");
                feGaussianBlur.setAttribute("result", "blur");

                const feColorMatrix = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "feColorMatrix"
                );
                feColorMatrix.setAttribute("in", "blur");
                feColorMatrix.setAttribute("type", "matrix");
                feColorMatrix.setAttribute(
                  "values",
                  "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"
                );

                const feMerge = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "feMerge"
                );
                const feMergeNode1 = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "feMergeNode"
                );
                feMergeNode1.setAttribute("in", "colorMatrix");
                const feMergeNode2 = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "feMergeNode"
                );
                feMergeNode2.setAttribute("in", "SourceGraphic");

                feMerge.appendChild(feMergeNode1);
                feMerge.appendChild(feMergeNode2);

                shadowFilter.appendChild(feOffset);
                shadowFilter.appendChild(feGaussianBlur);
                shadowFilter.appendChild(feColorMatrix);
                shadowFilter.appendChild(feMerge);
                defs.appendChild(shadowFilter);
              }

              // Apply font to all text elements
              const textElements = svgElement.querySelectorAll("text, tspan");
              textElements.forEach((text) => {
                const element = text as SVGElement;
                element.style.fontFamily =
                  '"Geist Mono", "Geist", ui-monospace, monospace';
                // Set font weight to 400 for all text
                element.style.fontWeight = "400";

                // Reduce title font sizes - detect larger text that's likely a title
                const currentSize =
                  element.getAttribute("font-size") ||
                  window.getComputedStyle(element).fontSize ||
                  element.style.fontSize;
                if (currentSize) {
                  const sizeValue = parseFloat(currentSize);
                  // If font size is 14px or larger, reduce it by 15-20%
                  if (sizeValue >= 14) {
                    const newSize = sizeValue * 0.8; // Reduce by 15%
                    element.style.fontSize = `${newSize}px`;
                  }
                }

                // State diagram: Ensure all text is white
                const isStateDiagram = svgElement.querySelector(
                  '.stateNode, .state-node, [class*="state"]'
                );
                if (isStateDiagram) {
                  element.style.fill = "#ffffff";
                  element.style.color = "#ffffff";
                }
              });

              // State diagram: Update borders to darker
              const stateBoxes = svgElement.querySelectorAll(
                'rect[class*="state"], rect[id*="state"], .state-node rect, .stateNode rect'
              );
              stateBoxes.forEach((box) => {
                const rect = box as SVGRectElement;
                rect.setAttribute("stroke", "#555555");
                rect.setAttribute("stroke-width", "1");
              });

              // ER Diagram: Update connection lines to be brighter
              const allPaths = svgElement.querySelectorAll("path, line");
              const erLines = Array.from(allPaths).filter(() => {
                // Check if it's likely an ER diagram connection line
                const hasErEntities = svgElement.querySelector(
                  '.er-entity, .entityBox, [class*="erDiagram"]'
                );
                return hasErEntities !== null;
              });

              erLines.forEach((line) => {
                const path = line as SVGPathElement | SVGLineElement;
                const stroke =
                  path.getAttribute("stroke") || path.style.stroke || "";
                // If line is dark (#777, #555, #666, etc.), make it brighter (#999)
                if (
                  !stroke ||
                  stroke.includes("777") ||
                  stroke.includes("555") ||
                  stroke.includes("666") ||
                  stroke === "#555555" ||
                  stroke === "#666666" ||
                  stroke === "#777777" ||
                  (stroke.includes("rgb") && !stroke.includes("255"))
                ) {
                  path.setAttribute("stroke", "#999999");
                  path.style.stroke = "#999999";
                }
              });

              // ER Diagram: Add padding and opacity to relationship labels (places, contains, uses)
              // Target all text elements that are likely relationship labels (positioned on lines)
              const allTexts = svgElement.querySelectorAll("text");
              const erLabels = Array.from(allTexts).filter((text) => {
                const textContent = text.textContent?.toLowerCase() || "";
                // Check if it's likely a relationship label (words like places, contains, uses, etc.)
                const commonRelWords = [
                  "places",
                  "contains",
                  "uses",
                  "has",
                  "belongs",
                  "creates",
                ];
                return (
                  commonRelWords.some((word) => textContent.includes(word)) ||
                  text.getAttribute("class")?.includes("relationship") ||
                  text.getAttribute("class")?.includes("er-")
                );
              });

              erLabels.forEach((label) => {
                const element = label as SVGTextElement;
                // Find the parent group or create a background rect
                const parent = element.parentElement;
                if (parent) {
                  // Create or update background rect for padding
                  let bgRect = parent.querySelector(
                    ".er-label-bg"
                  ) as SVGRectElement;
                  const bbox = element.getBBox();
                  if (!bgRect) {
                    bgRect = document.createElementNS(
                      "http://www.w3.org/2000/svg",
                      "rect"
                    );
                    bgRect.classList.add("er-label-bg");
                    parent.insertBefore(bgRect, element);
                  }
                  const padding = 4;
                  bgRect.setAttribute("x", String(bbox.x - padding));
                  bgRect.setAttribute("y", String(bbox.y - padding));
                  bgRect.setAttribute(
                    "width",
                    String(bbox.width + padding * 2)
                  );
                  bgRect.setAttribute(
                    "height",
                    String(bbox.height + padding * 2)
                  );
                  bgRect.setAttribute("fill", "rgba(68, 68, 68, 0.7)");
                  bgRect.setAttribute("rx", "8");
                  bgRect.setAttribute("ry", "8");
                }
                element.style.fill = "#ffffff";
              });

              // Apply 8px border radius to all boxes, shapes, and elements for professional look
              // Also apply shadow filter to boxes
              const allRects = svgElement.querySelectorAll("rect");
              allRects.forEach((rect) => {
                const r = rect as SVGRectElement;
                // Skip very small rects (likely decorative elements)
                const width = parseFloat(r.getAttribute("width") || "0");
                const height = parseFloat(r.getAttribute("height") || "0");
                if (width > 10 && height > 10) {
                  r.setAttribute("rx", "8");
                  r.setAttribute("ry", "8");
                  // Apply shadow filter to boxes
                  r.setAttribute("filter", "url(#box-shadow-filter)");
                  // Set border color to #555 for boxes (darker, less bright)
                  const currentStroke = r.getAttribute("stroke");
                  if (
                    currentStroke &&
                    currentStroke !== "none" &&
                    currentStroke !== "transparent"
                  ) {
                    r.setAttribute("stroke", "#444444");
                  } else if (!currentStroke) {
                    // Only set if there's no stroke (to avoid overriding special cases)
                    // Most boxes will get border from theme, but ensure it's #555
                  }
                }
              });

              // Apply rounded corners to polygons by converting to paths where possible
              const polygons = svgElement.querySelectorAll("polygon");
              polygons.forEach((polygon) => {
                const p = polygon as SVGPolygonElement;
                const points = p.getAttribute("points");
                if (points) {
                  // For triangles and shapes, we can't directly add border radius,
                  // but we can ensure the shape looks clean
                  // Note: SVG polygons don't support rx/ry, but we can ensure styling is clean
                  // p.setAttribute('stroke-linejoin', 'round');
                  // p.setAttribute('stroke-linecap', 'round');
                }
              });

              // Ensure all paths have smooth, rounded joins
              // For class diagrams and other diagrams, convert curved paths to straight/orthogonal lines
              const paths = svgElement.querySelectorAll("path");
              paths.forEach((path) => {
                const p = path as SVGPathElement;

                p.setAttribute("stroke-linejoin", "round");
                p.setAttribute("stroke-linecap", "round");
              });

              // Apply smooth edges to ellipses and circles
              const ellipses = svgElement.querySelectorAll("ellipse, circle");
              ellipses.forEach((ellipse) => {
                const e = ellipse as SVGEllipseElement;
                e.setAttribute("stroke-linejoin", "round");
                e.setAttribute("stroke-linecap", "round");
              });

              // Architecture-beta diagram: Style the outer dashed border
              // Check for dashed strokes (architecture diagrams use dashed borders for groups)
              const dashedElements = Array.from(
                svgElement.querySelectorAll("rect, path, polygon")
              ).filter((el) => {
                const dashArray =
                  el.getAttribute("stroke-dasharray") ||
                  (el as SVGElement).style.strokeDasharray;
                return dashArray && dashArray !== "none" && dashArray !== "0";
              });

              if (dashedElements.length > 0) {
                // Find the outermost/largest dashed element (the group border)
                let largestElement: SVGElement | null = null;
                let largestArea = 0;

                dashedElements.forEach((el) => {
                  const bbox = (
                    el as SVGRectElement | SVGPathElement
                  ).getBBox();
                  const area = bbox.width * bbox.height;
                  if (area > largestArea) {
                    largestArea = area;
                    largestElement = el as SVGElement;
                  }
                });

                // Set the outer dashed border color to #555
                if (largestElement) {
                  const element = largestElement as SVGElement;
                  element.setAttribute("stroke", "#555555");
                  (element as any).style.stroke = "#555555";
                }
              }

              // Pie chart: Make background transparent
              // Check if this is a pie chart by looking for circular paths (pie slices)
              const piePaths = svgElement.querySelectorAll("path");
              const hasPieChart = Array.from(piePaths).some((path) => {
                const d = path.getAttribute("d") || "";
                // Pie charts typically have arc paths (commands starting with A or a)
                return d.includes("A") || d.includes("a") || d.includes("arc");
              });

              if (hasPieChart) {
                // Find and make all background rects transparent for pie charts
                const allRects = svgElement.querySelectorAll("rect");
                allRects.forEach((rect) => {
                  const r = rect as SVGRectElement;
                  const fill = r.getAttribute("fill") || r.style.fill || "";

                  // Check if it's a dark gray background (like #393939, #444, rgba dark colors, etc.)
                  const isDarkBackground =
                    fill === "#393939" ||
                    fill === "#444444" ||
                    fill === "#444" ||
                    fill === "rgb(57, 57, 57)" ||
                    fill === "rgb(68, 68, 68)" ||
                    fill.includes("rgba(68, 68, 68") ||
                    fill.includes("rgba(57, 57, 57") ||
                    (fill.includes("rgb") && !fill.includes("255")); // Dark colors that aren't white/bright

                  // Also check by size - large rects behind the chart are likely backgrounds
                  const width = parseFloat(r.getAttribute("width") || "0");
                  const height = parseFloat(r.getAttribute("height") || "0");
                  const isLargeRect = width > 100 && height > 100;

                  if (
                    isDarkBackground ||
                    (isLargeRect &&
                      fill &&
                      fill !== "none" &&
                      fill !== "transparent")
                  ) {
                    // Make transparent
                    r.setAttribute("fill", "transparent");
                    r.style.fill = "transparent";
                  }
                });

                // Remove the pie-background we might have added earlier
                const pieBg = svgElement.querySelector(
                  ".pie-background"
                ) as SVGRectElement;
                if (pieBg) {
                  pieBg.remove();
                }
              }
            }
          }, 10);

          // Initialize zoom/pan after a short delay to ensure SVG is rendered
          // Skip panzoom initialization if in preview mode
          if (!previewMode) {
            setTimeout(() => {
              const svgElement = containerRef.current?.querySelector(
                "svg"
              ) as SVGSVGElement;

              if (svgElement && !panzoomInstanceRef.current) {
                // Set cursor style
                svgElement.style.cursor = "grab";

                // Initialize Panzoom with zoom and pan capabilities
                // Disable autocenter - we'll handle centering manually for better control
                const panzoomInstance = createPanZoom(svgElement, {
                  maxZoom: 5,
                  minZoom: 0.5,
                  zoomSpeed: 0.1,
                  autocenter: false, // Always false - we handle centering manually
                });

                panzoomInstanceRef.current = panzoomInstance;
                setIsPanzoomReady(true);

                // Only center and zoom on first initialization, not on every edit
                if (!hasInitializedZoom.current) {
                  // Center and zoom to fit the diagram on initial load
                  setTimeout(() => {
                    if (!panzoomInstanceRef.current || !containerRef.current)
                      return;

                    const svgElement = containerRef.current.querySelector(
                      "svg"
                    ) as SVGSVGElement;
                    if (!svgElement) return;

                    try {
                      const svgBBox = svgElement.getBBox();
                      const containerRect =
                        containerRef.current.getBoundingClientRect();

                      if (
                        containerRect &&
                        svgBBox.width > 0 &&
                        svgBBox.height > 0
                      ) {
                        // Calculate the scale to fit the diagram in the container with some padding
                        const padding = 60; // Padding around the diagram (increased for more breathing room)
                        const scaleX =
                          (containerRect.width - padding * 2) / svgBBox.width;
                        const scaleY =
                          (containerRect.height - padding * 2) / svgBBox.height;
                        let scale = Math.min(scaleX, scaleY, 1); // Don't zoom in, only zoom out to fit
                        
                        // Zoom out a bit more for better visual appearance (85% of calculated scale)
                        scale = scale * 0.85;

                        // Get the center of the SVG content bounding box (in SVG coordinates)
                        // This represents the center of the actual diagram content
                        const svgContentCenterX = svgBBox.x + svgBBox.width / 2;
                        const svgContentCenterY = svgBBox.y + svgBBox.height / 2;

                        // Get container center (in container/client coordinates)
                        const containerCenterX = containerRect.width / 2;
                        const containerCenterY = containerRect.height / 2;

                        // Calculate the final transform to center the entire diagram content
                        // We need to position the center of the scaled diagram at the center of the container
                        // When we scale, the center point needs to be translated correctly
                        // finalX/Y should move the scaled center point to the container center
                        const finalX = containerCenterX - svgContentCenterX * scale;
                        const finalY = containerCenterY - svgContentCenterY * scale;

                        // Apply the transform using panzoom
                        // Try setTransform first if available (most reliable)
                        const setTransform = (panzoomInstanceRef.current as any)?.setTransform;
                        if (setTransform && typeof setTransform === "function") {
                          setTransform({ x: finalX, y: finalY, scale });
                        } else {
                          // Fallback: Apply transform manually to SVG and sync with panzoom
                          // This ensures the diagram is centered regardless of panzoom API
                          // Panzoom uses transformOrigin 0 0, so we apply the transform directly
                          svgElement.style.transformOrigin = "0 0";
                          svgElement.style.transform = `translate(${finalX}px, ${finalY}px) scale(${scale})`;
                          
                          // Try to sync panzoom's internal state so it knows about our transform
                          try {
                            // First, get the current transform (might be default 0,0,1)
                            const currentTransform = panzoomInstanceRef.current.getTransform();
                            
                            // Update panzoom's internal state to match our manual transform
                            // Panzoom stores transform as {x, y, scale}
                            // We need to tell panzoom what we've set manually
                            const panzoomTransform = {
                              x: finalX,
                              y: finalY,
                              scale: scale
                            };
                            
                            // Try to use panzoom's internal update method if available
                            const updateTransform = (panzoomInstanceRef.current as any)?.updateTransform;
                            if (updateTransform && typeof updateTransform === "function") {
                              updateTransform(panzoomTransform);
                            } else {
                              // Otherwise, try to move and zoom separately
                              panzoomInstanceRef.current.moveTo(finalX, finalY);
                              
                              // Try to set zoom level if panzoom supports it
                              const zoomAbs = (panzoomInstanceRef.current as any)?.zoomAbs;
                              const zoomTo = (panzoomInstanceRef.current as any)?.zoomTo;
                              
                              if (zoomAbs && typeof zoomAbs === "function") {
                                zoomAbs(scale);
                              } else if (zoomTo && typeof zoomTo === "function") {
                                zoomTo(scale);
                              } else {
                                // If we can't set zoom directly, try smoothZoom at container center
                                const currentScale = currentTransform.scale || 1;
                                if (currentScale !== scale) {
                                  const zoomDiff = scale / currentScale;
                                  const smoothZoom = (panzoomInstanceRef.current as any)?.smoothZoom;
                                  if (smoothZoom && typeof smoothZoom === "function") {
                                    smoothZoom(containerCenterX, containerCenterY, zoomDiff);
                                  }
                                }
                              }
                            }
                          } catch (syncError) {
                            // If syncing fails, at least the manual transform is applied
                            // The diagram will still be centered visually
                            console.warn("Could not sync panzoom state, but transform is applied");
                          }
                        }
                      }
                    } catch (e) {
                      // Fallback to simple centering if getBBox fails
                      if (panzoomInstanceRef.current && containerRef.current) {
                        const containerRect =
                          containerRef.current.getBoundingClientRect();
                        const svgElement = containerRef.current.querySelector("svg") as SVGSVGElement;
                        if (svgElement) {
                          try {
                            const svgBBox = svgElement.getBBox();
                            // Calculate the center of the entire diagram content
                            const svgContentCenterX = svgBBox.x + svgBBox.width / 2;
                            const svgContentCenterY = svgBBox.y + svgBBox.height / 2;
                            // Calculate scale to fit
                            const padding = 60;
                            const scaleX = (containerRect.width - padding * 2) / svgBBox.width;
                            const scaleY = (containerRect.height - padding * 2) / svgBBox.height;
                            let scale = Math.min(scaleX, scaleY, 1) * 0.85;
                            
                            // Position the center of the diagram at the center of the container
                            const finalX = containerRect.width / 2 - svgContentCenterX * scale;
                            const finalY = containerRect.height / 2 - svgContentCenterY * scale;
                            
                            panzoomInstanceRef.current.moveTo(finalX, finalY);
                          } catch {
                            // If still fails, just center at 0,0
                            panzoomInstanceRef.current.moveTo(
                              containerRect.width / 2,
                              containerRect.height / 2
                            );
                          }
                        }
                      }
                    }

                    hasInitializedZoom.current = true;
                  }, 150);
                } else {
                  // On subsequent renders, restore previous transform immediately without any centering
                  if (
                    previousTransformRef.current &&
                    panzoomInstanceRef.current
                  ) {
                    const savedTransform = previousTransformRef.current;
                    const instance = panzoomInstanceRef.current;

                    // Apply transform immediately after a brief delay to ensure SVG is ready
                    setTimeout(() => {
                      try {
                        const setTransform = (instance as any)?.setTransform;
                        if (
                          setTransform &&
                          typeof setTransform === "function"
                        ) {
                          setTransform(savedTransform);
                        } else {
                          // Try to restore zoom level first if possible
                          // Then restore position
                          instance.moveTo(savedTransform.x, savedTransform.y);
                        }
                      } catch (e) {
                        // Ignore errors restoring transform
                        console.warn("Failed to restore transform:", e);
                      }
                    }, 100);
                  }
                }

                // Update cursor on drag
                svgElement.addEventListener("mousedown", () => {
                  svgElement.style.cursor = "grabbing";
                });

                svgElement.addEventListener("mouseup", () => {
                  svgElement.style.cursor = "grab";
                });

                svgElement.addEventListener("mouseleave", () => {
                  svgElement.style.cursor = "grab";
                });
              }
            }, 50);
          }
        }
      } catch (error) {
        // Safely extract error message without JSON.stringify to avoid circular reference issues
        let errorMessage = "Invalid Mermaid syntax";
        try {
          // Safely get error message without accessing potentially circular properties
          if (error instanceof Error) {
            const msg = error.message || String(error);
            // Filter out generic "Syntax error in text mermaid version" messages
            if (
              msg &&
              !msg.includes("Syntax error in text") &&
              !msg.includes("mermaid version")
            ) {
              // Check for circular reference error
              if (
                msg.includes("circular structure") ||
                msg.includes("circular") ||
                msg.includes("JSON")
              ) {
                errorMessage =
                  "Diagram rendering error. Please check your Mermaid syntax.";
              } else {
                errorMessage = msg;
              }
            } else if (msg.includes("Parse error")) {
              // Extract parse error details
              const parseMatch = msg.match(/Parse error[^:]*:\s*(.+)/);
              errorMessage = parseMatch
                ? parseMatch[1]
                : "Parse error in diagram syntax";
            } else {
              errorMessage =
                "Invalid diagram syntax. Please check your Mermaid code.";
            }
          } else if (typeof error === "string") {
            if (
              error.includes("circular structure") ||
              error.includes("circular") ||
              error.includes("JSON")
            ) {
              errorMessage =
                "Diagram rendering error. Please check your Mermaid syntax.";
            } else if (
              !error.includes("Syntax error in text") &&
              !error.includes("mermaid version")
            ) {
              errorMessage = error;
            } else {
              errorMessage =
                "Invalid diagram syntax. Please check your Mermaid code.";
            }
          } else {
            // Try to safely stringify non-circular parts
            try {
              const errorStr = String(error);
              if (errorStr.includes("circular") || errorStr.includes("JSON")) {
                errorMessage =
                  "Diagram rendering error. Please check your Mermaid syntax.";
              } else {
                errorMessage =
                  errorStr ||
                  "Invalid diagram syntax. Please check your Mermaid code.";
              }
            } catch {
              errorMessage =
                "Invalid diagram syntax. Please check your Mermaid code.";
            }
          }
        } catch (e) {
          // If we can't extract error, show generic helpful message
          errorMessage =
            "Invalid diagram syntax. Please check your Mermaid code.";
        }

        if (containerRef.current) {
          // Display error with better styling
          containerRef.current.innerHTML = `
            <div style="
              color: #ff6b6b;
              padding: 2rem;
              text-align: center;
              font-family: 'Geist Mono', 'Geist', ui-monospace, monospace;
              font-size: 14px;
              line-height: 1.6;
              background: rgba(255, 107, 107, 0.1);
              border: 1px solid rgba(255, 107, 107, 0.3);
              border-radius: 8px;
              margin: 1rem;
            ">
              <div style="font-weight: 600; margin-bottom: 0.5rem;">Diagram Error</div>
              <div style="color: #ff9999;">${errorMessage}</div>
            </div>
          `;
        }
        
        // Notify parent component about the error
        if (onError) {
          onError(true, errorMessage);
        }
      }
    };

    // Wait a bit to ensure mermaid is initialized
    const timeoutId = setTimeout(() => {
      renderMermaid();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.dispose();
        panzoomInstanceRef.current = null;
      }
    };
  }, [text, previewMode]);

  const handleZoomIn = () => {
    if (!panzoomInstanceRef.current || !containerRef.current) return;
    
    const svgElement = containerRef.current.querySelector("svg") as SVGSVGElement;
    if (!svgElement) return;

    try {
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      
      const currentTransform = panzoomInstanceRef.current.getTransform();
      const newScale = Math.min(currentTransform.scale * 1.2, 5); // Max zoom 5x
      const zoomDiff = newScale / currentTransform.scale;
      
      const smoothZoom = (panzoomInstanceRef.current as any)?.smoothZoom;
      if (smoothZoom && typeof smoothZoom === "function") {
        smoothZoom(centerX, centerY, zoomDiff);
      } else {
        // Fallback: use setTransform
        const setTransform = (panzoomInstanceRef.current as any)?.setTransform;
        if (setTransform && typeof setTransform === "function") {
          setTransform({ ...currentTransform, scale: newScale });
        }
      }
    } catch (error) {
      console.error("Error zooming in:", error);
    }
  };

  const handleZoomOut = () => {
    if (!panzoomInstanceRef.current || !containerRef.current) return;
    
    const svgElement = containerRef.current.querySelector("svg") as SVGSVGElement;
    if (!svgElement) return;

    try {
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      
      const currentTransform = panzoomInstanceRef.current.getTransform();
      const newScale = Math.max(currentTransform.scale / 1.2, 0.5); // Min zoom 0.5x
      const zoomDiff = newScale / currentTransform.scale;
      
      const smoothZoom = (panzoomInstanceRef.current as any)?.smoothZoom;
      if (smoothZoom && typeof smoothZoom === "function") {
        smoothZoom(centerX, centerY, zoomDiff);
      } else {
        // Fallback: use setTransform
        const setTransform = (panzoomInstanceRef.current as any)?.setTransform;
        if (setTransform && typeof setTransform === "function") {
          setTransform({ ...currentTransform, scale: newScale });
        }
      }
    } catch (error) {
      console.error("Error zooming out:", error);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: previewMode ? "100%" : "100%",
        overflow: previewMode ? "hidden" : "hidden",
        position: "relative",
        backgroundColor: previewMode ? "#0D0D0D" : "#1D1D1D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Zoom Controls */}
      {!previewMode && isPanzoomReady && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            zIndex: 1000,
          }}
        >
          {/* Zoom In Button */}
          <IconButton
            onClick={handleZoomIn}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              color: "rgba(255, 255, 255, 0.9)",
              width: 40,
              height: 40,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Box
              component="svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" />
              <path d="M10.5 7.5v6" />
              <path d="M7.5 10.5h6" />
              <path d="m16.61 16.611 4.244 4.243" />
            </Box>
          </IconButton>

          {/* Zoom Out Button */}
          <IconButton
            onClick={handleZoomOut}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              color: "rgba(255, 255, 255, 0.9)",
              width: 40,
              height: 40,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Box
              component="svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" />
              <path d="M7.5 10.5h6" />
              <path d="m16.61 16.611 4.244 4.243" />
            </Box>
          </IconButton>
        </Box>
      )}
    </div>
  );
};
