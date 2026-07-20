import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import WebFont from "webfontloader";
import Sidebar from "./SideBar";
import TopHeader from "./TopHeader";
import BottomBar from "./BottomBar";
import FrameEditorMobile from "./FrameEditorMobile";

export const FONTS = [
  "Segoe Script",
  "Inspiration",
  "Schoolbell",
  "Shadows Into Light Two",
  "Shadows Into Light",
  "Birthstone Bounce",
  "Arial",
  "Poppins",
  "Montserrat",
  "Playfair Display",
  "Pacifico",
  "Dancing Script",
  "Roboto",
  "Lato",
  "Merriweather",
  "Oswald",
  "Raleway",
  "Inter",

  "Abril Fatface",
  "Acme",
  "Alfa Slab One",
  "Anton",
  "Archivo",
  "Arvo",
  "Bangers",
  "Barlow",
  "Bebas Neue",
  "Bitter",
  "Bree Serif",
  "Cabin",
  "Cairo",
  "Cardo",
  "Caveat",
  "Cinzel",
  "Comfortaa",
  "Cormorant Garamond",
  "Courgette",
  "Crete Round",
  "Crimson Text",
  "DM Sans",
  "Domine",
  "EB Garamond",
  "Exo 2",
  "Figtree",
  "Fira Sans",
  "Fredoka",
  "Gabarito",
  "Gloria Hallelujah",
  "Great Vibes",
  "Hind",
  "IBM Plex Sans",
  "Inconsolata",
  "Indie Flower",
  "Josefin Sans",
  "Jost",
  "Kalam",
  "Kanit",
  "Karla",
  "Libre Baskerville",
  "Libre Franklin",
  "Lobster",
  "Manrope",
  "Maven Pro",
  "Mulish",
  "Nanum Gothic",
  "Noto Sans",
  "Nunito",
  "Open Sans",
  "Orbitron",
  "Outfit",
  "Oxygen",
  "PT Sans",
  "PT Serif",
  "Patrick Hand",
  "Permanent Marker",
  "Philosopher",
  "Plus Jakarta Sans",
  "Poiret One",
  "Prompt",
  "Quattrocento",
  "Quicksand",
  "Questrial",
  "Rajdhani",
  "Red Hat Display",
  "Righteous",
  "Rubik",
  "Sacramento",
  "Satisfy",
  "Shadows Into Light",
  "Signika",
  "Slabo 27px",
  "Source Sans Pro",
  "Space Grotesk",
  "Teko",
  "Tinos",
  "Titillium Web",
  "Ubuntu",
  "Urbanist",
  "Varela Round",
  "Work Sans",
  "Yanone Kaffeesatz",
  "Zilla Slab",

  "Amatic SC",
  "Baloo 2",
  "Bungee",
  "Cookie",
  "Fugaz One",
  "Kaushan Script",
  "Luckiest Guy",
  "Monoton",
  "Rochester",
  "Rock Salt",
  "Sora",
  "Tilt Neon",
  "Unbounded",
  "Yellowtail",
  "Yeseva One",
];

export default function FrameEditor({ open, onClose, frameConfig }) {
  const FRAMES = frameConfig ? [frameConfig.frameImage] : [];

  const TEXT_SLOTS = frameConfig?.textSlots || [];
  const elementModules = import.meta.glob(
    "../assets/elements/*.{png,jpg,jpeg,webp,svg}",
    {
      eager: true,
    },
  );

  const ELEMENTS = Object.values(elementModules).map(
    (module) => module.default,
  );
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedCanvasElement, setSelectedCanvasElement] = useState(null);
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [selectedText, setSelectedText] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [fontSizeInput, setFontSizeInput] = useState("");
  const [toolbarPos, setToolbarPos] = useState({
    left: 0,
    top: 0,
  });
  const [selectedFont, setSelectedFont] = useState("Arial");

  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(1);
  const [mobileOffset, setMobileOffset] = useState({ x: 0, y: 0 });
  const mobileWrapperRef = useRef(null);
  const mobilePointersRef = useRef(new Map());
  const mobilePanStartRef = useRef(null);
  const mobilePinchRef = useRef({ dist: 0, zoom: 1 });

  useEffect(() => {
    if (frameConfig?.frameImage) {
      setSelectedFrame(frameConfig.frameImage);
    }
  }, [frameConfig]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: FONTS,
      },
    });
  }, []);

  const zoomIn = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const zoom = Math.min(canvas.getZoom() * 1.2, 5);

    canvas.setZoom(zoom);

    canvas.selection = zoom <= 1;
  };

  const resetZoom = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);

    canvas.selection = true;
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getTouchDistance = (a, b) =>
    Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);

  const handleMobilePointerDown = (ev) => {
    if (!isMobileView || ev.pointerType !== "touch") return;

    mobilePointersRef.current.set(ev.pointerId, ev);

    if (mobilePointersRef.current.size === 2) {
      const [a, b] = Array.from(mobilePointersRef.current.values());

      mobilePinchRef.current = {
        dist: getTouchDistance(a, b),
        zoom: mobileZoom,
      };

      mobilePanStartRef.current = null;
      return;
    }

    if (mobilePointersRef.current.size === 1) {
      mobilePanStartRef.current = {
        x: ev.clientX,
        y: ev.clientY,
        startX: mobileOffset.x,
        startY: mobileOffset.y,
      };
    }
  };

  const handleMobilePointerMove = (ev) => {
    if (!isMobileView || ev.pointerType !== "touch") return;

    mobilePointersRef.current.set(ev.pointerId, ev);

    if (mobilePointersRef.current.size === 2) {
      ev.preventDefault();

      const [a, b] = Array.from(mobilePointersRef.current.values());
      const dist = getTouchDistance(a, b);
      const scale =
        mobilePinchRef.current.dist > 0
          ? dist / mobilePinchRef.current.dist
          : 1;
      const nextZoom = clamp(mobilePinchRef.current.zoom * scale, 1, 4);

      setMobileZoom(nextZoom);
      return;
    }

    if (mobilePointersRef.current.size === 1 && mobilePanStartRef.current) {
      ev.preventDefault();

      const dx = ev.clientX - mobilePanStartRef.current.x;
      const dy = ev.clientY - mobilePanStartRef.current.y;
      const wrapper = mobileWrapperRef.current;
      let maxX = 0;
      let maxY = 0;

      if (wrapper) {
        const width = wrapper.offsetWidth;
        const height = wrapper.offsetHeight;
        maxX = Math.max(0, ((width * mobileZoom) - width) / 2);
        maxY = Math.max(0, ((height * mobileZoom) - height) / 2);
      }

      const nextX = clamp(mobilePanStartRef.current.startX + dx, -maxX, maxX);
      const nextY = clamp(mobilePanStartRef.current.startY + dy, -maxY, maxY);

      setMobileOffset({ x: nextX, y: nextY });
    }
  };

  const handleMobilePointerUp = (ev) => {
    if (!isMobileView || ev.pointerType !== "touch") return;

    mobilePointersRef.current.delete(ev.pointerId);

    if (mobilePointersRef.current.size < 2) {
      mobilePinchRef.current.dist = 0;
    }

    if (mobilePointersRef.current.size === 1) {
      const [remaining] = Array.from(mobilePointersRef.current.values());
      mobilePanStartRef.current = {
        x: remaining.clientX,
        y: remaining.clientY,
        startX: mobileOffset.x,
        startY: mobileOffset.y,
      };
    }

    if (mobilePointersRef.current.size === 0) {
      mobilePanStartRef.current = null;
    }
  };

  useEffect(() => {
    const updateMobileView = () => setIsMobileView(window.innerWidth < 768);

    updateMobileView();
    window.addEventListener("resize", updateMobileView);

    return () => window.removeEventListener("resize", updateMobileView);
  }, []);

  // If mobile, delegate to the dedicated mobile editor component
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return <FrameEditorMobile open={open} onClose={onClose} frameConfig={frameConfig} />;
  }

  useEffect(() => {
    if (open) {
      setMobileZoom(1);
      setMobileOffset({ x: 0, y: 0 });
      mobilePointersRef.current.clear();
      mobilePanStartRef.current = null;
      mobilePinchRef.current = { dist: 0, zoom: 1 };
    }
  }, [open]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: FONTS,
      },
    });
  }, []);
  useEffect(() => {
    if (!open) return;
    loadGoogleFont("Poppins");
    loadGoogleFont("Montserrat");
    loadGoogleFont("Playfair Display");
    loadGoogleFont("Pacifico");
    loadGoogleFont("Dancing Script");

    const canvasSize = window.innerWidth < 768 ? window.innerWidth - 30 : 700;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize,
      height: canvasSize,

      preserveObjectStacking: true,
      backgroundColor: "#ffffff",
      enableRetinaScaling: true,
      selection: false,
      renderOnAddRemove: true,
      skipOffscreen: true,
    });

    fabricCanvasRef.current = canvas;
    const isMobileCanvas = window.innerWidth < 768;

    // keep the same coordinate system while boosting internal pixel density
    canvas.setDimensions(
      {
        width: 2100,
        height: 2100,
      },
      { backstoreOnly: true },
    );

    fabric.Object.prototype.objectCaching = false;

    // Configure selection box styling to be darker
    fabric.Object.prototype.borderColor = "#1e40af"; // Dark blue
    fabric.Object.prototype.cornerColor = "#1e40af"; // Dark blue
    fabric.Object.prototype.cornerSize = 10;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderDashArray = [0];
    fabric.Object.prototype.borderScaleFactor = 2;

    canvas.getContext().imageSmoothingEnabled = true;
    canvas.getContext().imageSmoothingQuality = "high";

    // Ensure canvas renders properly after modifications
    canvas.on("after:render", () => {
      canvas.clearContext(canvas.contextTop);
    });

    if (!isMobileCanvas) {
      // ==========================
      // PAN WHEN ZOOMED
      // ==========================

      let isDragging = false;
      let lastPosX;
      let lastPosY;

      canvas.on("mouse:down", (opt) => {
        if (canvas.getZoom() <= 1) return;

        isDragging = true;

        lastPosX = opt.e.clientX;
        lastPosY = opt.e.clientY;
      });

      canvas.on("mouse:move", (opt) => {
        if (!isDragging) return;

        const e = opt.e;

        const vpt = canvas.viewportTransform;

        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;

        canvas.requestRenderAll();

        lastPosX = e.clientX;
        lastPosY = e.clientY;
      });

      canvas.on("mouse:up", () => {
        isDragging = false;
      });

      try {
        const upperEl = canvas.upperCanvasEl;

        if (upperEl) upperEl.style.touchAction = "none";

        // pointer-based multi-touch handling (works on modern mobile browsers)
        const pointers = new Map();
        let lastPan = null;
        let lastPinchDist = 0;
        let pinchStartZoom = 1;
        let renderScheduled = false;

        const getDist = (p1, p2) =>
          Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);

        const scheduleRender = () => {
          if (!renderScheduled) {
            renderScheduled = true;
            requestAnimationFrame(() => {
              canvas.requestRenderAll();
              renderScheduled = false;
            });
          }
        };

        const constrainViewport = () => {
          const vpt = canvas.viewportTransform;
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();

          vpt[4] = Math.max(
            -canvasWidth * 0.5,
            Math.min(canvasWidth * 0.5, vpt[4]),
          );
          vpt[5] = Math.max(
            -canvasHeight * 0.5,
            Math.min(canvasHeight * 0.5, vpt[5]),
          );
        };

        const onPointerDown = (ev) => {
          if (ev.pointerType !== "touch") return;
          pointers.set(ev.pointerId, ev);
          if (pointers.size === 2) {
            const [a, b] = Array.from(pointers.values());
            lastPinchDist = getDist(a, b);
            pinchStartZoom = canvas.getZoom();
          }
        };

        const onPointerMove = (ev) => {
          if (ev.pointerType !== "touch") return;

          pointers.set(ev.pointerId, ev);

          // ---------- PINCH ----------
          if (pointers.size === 2) {
            ev.preventDefault();

            const [a, b] = Array.from(pointers.values());

            const dist = getDist(a, b);

            if (!lastPinchDist) lastPinchDist = dist;

            const scale = dist / lastPinchDist;

            const zoom = Math.max(1, Math.min(5, pinchStartZoom * scale));

            canvas.setZoom(zoom);
            scheduleRender();

            return;
          }

          // ---------- PAN ----------
          if (pointers.size === 1 && canvas.getZoom() > 1) {
            ev.preventDefault();

            if (!lastPan) {
              lastPan = {
                x: ev.clientX,
                y: ev.clientY,
              };

              return;
            }

            const dx = ev.clientX - lastPan.x;
            const dy = ev.clientY - lastPan.y;
            const vpt = canvas.viewportTransform;
            vpt[4] += dx;
            vpt[5] += dy;

            constrainViewport();

            lastPan = {
              x: ev.clientX,
              y: ev.clientY,
            };

            scheduleRender();
          }
        };

        const onPointerUp = (ev) => {
          pointers.delete(ev.pointerId);

          lastPan = null;

          if (pointers.size < 2) {
            lastPinchDist = 0;
          }

          if (canvas.getZoom() <= 1) {
            canvas.selection = true;
          }

          pinchStartZoom = canvas.getZoom();
        };

        let lastTouch = null;
        const onTouchStart = (ev) => {
          if (ev.touches && ev.touches.length === 1) lastTouch = ev.touches[0];
        };
        const onTouchMove = (ev) => {
          if (ev.touches && ev.touches.length === 1 && canvas.getZoom() > 1) {
            ev.preventDefault();
            const touch = ev.touches[0];
            const deltaX = touch.clientX - (lastTouch?.clientX || touch.clientX);
            const deltaY = touch.clientY - (lastTouch?.clientY || touch.clientY);
            const vpt = canvas.viewportTransform;
            vpt[4] += deltaX;
            vpt[5] += deltaY;
            constrainViewport();
            lastTouch = touch;
            scheduleRender();
          }
        };
        const onTouchEnd = () => {
          lastTouch = null;
        };

        upperEl.addEventListener("pointerdown", onPointerDown);
        upperEl.addEventListener("pointermove", onPointerMove, {
          passive: false,
        });
        upperEl.addEventListener("pointerup", onPointerUp);
        upperEl.addEventListener("pointercancel", onPointerUp);

        upperEl.addEventListener("touchstart", onTouchStart, { passive: false });
        upperEl.addEventListener("touchmove", onTouchMove, { passive: false });
        upperEl.addEventListener("touchend", onTouchEnd);

        canvas.__touchCleanup = () => {
          try {
            if (upperEl) upperEl.style.touchAction = "";
            upperEl.removeEventListener("pointerdown", onPointerDown);
            upperEl.removeEventListener("pointermove", onPointerMove);
            upperEl.removeEventListener("pointerup", onPointerUp);
            upperEl.removeEventListener("pointercancel", onPointerUp);

            upperEl.removeEventListener("touchstart", onTouchStart);
            upperEl.removeEventListener("touchmove", onTouchMove);
            upperEl.removeEventListener("touchend", onTouchEnd);
          } catch (e) {}
        };
      } catch (e) {
        // ignore if upperCanvasEl not available
      }
    }

    // ==========================

    canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0];

      if (obj?.customType === "user-text") {
        setSelectedText(obj);
        
        // Get canvas element and its position in viewport
        const canvasElement = canvasRef.current;
        const canvasRect = canvasElement.getBoundingClientRect();
        
        // Get the object's bounding rect (in canvas coordinate system)
        const objRect = obj.getBoundingRect();
        
        // Calculate the display scale (CSS size vs actual canvas size)
        const displayScale = canvasRect.width / fabricCanvasRef.current.width;
        
        // Convert canvas coordinates to screen coordinates
        const screenLeft = canvasRect.left + (objRect.left * displayScale);
        const screenTop = canvasRect.top + (objRect.top * displayScale);
        
        setToolbarPos({
          left: screenLeft + (objRect.width * displayScale) / 2,
          top: screenTop + (objRect.height * displayScale) + 10, // 10px below text
        });
        
        setFontSizeInput(String(obj.fontSize || ""));
        setSelectedCanvasElement(null);
      } else if (obj?.customType === "element") {
        setSelectedCanvasElement(obj);
        setSelectedText(null);
      } else {
        setSelectedText(null);
        setSelectedCanvasElement(null);
      }
    });

    canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0];

      if (obj?.customType === "user-text") {
        setSelectedText(obj);
        
        // Get canvas element and its position in viewport
        const canvasElement = canvasRef.current;
        const canvasRect = canvasElement.getBoundingClientRect();
        
        // Get the object's bounding rect (in canvas coordinate system)
        const objRect = obj.getBoundingRect();
        
        // Calculate the display scale (CSS size vs actual canvas size)
        const displayScale = canvasRect.width / fabricCanvasRef.current.width;
        
        // Convert canvas coordinates to screen coordinates
        const screenLeft = canvasRect.left + (objRect.left * displayScale);
        const screenTop = canvasRect.top + (objRect.top * displayScale);
        
        setToolbarPos({
          left: screenLeft + (objRect.width * displayScale) / 2,
          top: screenTop + (objRect.height * displayScale) + 10, // 10px below text
        });
        
        setFontSizeInput(String(obj.fontSize || ""));
        setSelectedCanvasElement(null);
      } else if (obj?.customType === "element") {
        setSelectedCanvasElement(obj);
        setSelectedText(null);
      } else {
        setSelectedText(null);
        setSelectedCanvasElement(null);
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedText(null);
      setSelectedCanvasElement(null);
    });

    loadFrame(canvas, selectedFrame);

    return () => {
      try {
        if (typeof canvas.__touchCleanup === "function")
          canvas.__touchCleanup();
      } catch (e) {}

      canvas.dispose();
    };
  }, [open]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    loadFrame(canvas, selectedFrame);
  }, [selectedFrame]);

  const addNewText = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const textbox = new fabric.IText("Your text here", {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,

      originX: "center",
      originY: "center",

      fontSize: 30,
      fill: "#000000",
      fontFamily: "Arial",

      editable: true,
      customType: "user-text",
    });

    canvas.add(textbox);

    canvas.setActiveObject(textbox);

    canvas.renderAll();

    setSelectedText(textbox);
  };

  const loadFrame = (canvas, frameUrl) => {
    if (!canvas || !frameUrl) return;
    setIsFrameLoading(true);
    canvas.getObjects().forEach((obj) => {
      if (obj.customType === "frame") {
        canvas.remove(obj);
      }
    });

    fabric.Image.fromURL(frameUrl, (frame) => {
      const fitScale = Math.min(
        canvas.getWidth() / frame.width,
        canvas.getHeight() / frame.height,
      );

      frame.scale(fitScale);

      frame.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
        customType: "frame",
        objectCaching: false,
      });

      canvas.add(frame);

      frame.moveTo(canvas.getObjects().length - 1);

      canvas.renderAll();
      const existingText = canvas
        .getObjects()
        .some((obj) => obj.customType === "user-text");

      if (!existingText) {
        addTextSlots(canvas);
      }
      // Small delay → smoother premium feel
      setTimeout(() => {
        setIsFrameLoading(false);
      }, 350);
    },
    {
      crossOrigin: "anonymous",
    });
  };

  const chooseImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const canvas = fabricCanvasRef.current;

    const url = URL.createObjectURL(file);

    fabric.Image.fromURL(url, (img) => {
      const maxWidth = canvas.getWidth() * 0.6;

      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        customType: "user-image",

        // improves quality
        objectCaching: false,
      });

      // only shrink large images
      if (img.width > maxWidth) {
        img.scaleToWidth(maxWidth);
      }

      canvas.add(img);

      // keep image behind frame
      img.moveTo(0);

      canvas.setActiveObject(img);

      canvas.renderAll();

      URL.revokeObjectURL(url);
    });
  };

  const addElementToCanvas = (elementUrl) => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    fabric.Image.fromURL(elementUrl, (img) => {
      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,

        originX: "center",
        originY: "center",

        customType: "element",
      });

      img.scaleToWidth(120);

      canvas.add(img);

      // Always stay above everything
      img.moveTo(canvas.getObjects().length - 1);

      canvas.setActiveObject(img);

      canvas.renderAll();
    });
  };

  const changeElementColor = (color) => {
    const canvas = fabricCanvasRef.current;

    const obj = canvas?.getActiveObject();

    if (!obj || obj.customType !== "element") return;

    obj.filters = [
      new fabric.Image.filters.BlendColor({
        color,
        mode: "tint",
        alpha: 1,
      }),
    ];

    obj.applyFilters();

    canvas.renderAll();
  };

  const addTextSlots = (canvas) => {
    TEXT_SLOTS.forEach((slot) => {
      const textbox = new fabric.IText(slot.text, {
        left:
          window.innerWidth < 768
            ? canvas.getWidth() * slot.leftMobPercent
            : canvas.getWidth() * slot.leftPercent,

        top:
          window.innerWidth < 768
            ? canvas.getHeight() * slot.topMobPercent
            : canvas.getHeight() * slot.topPercent,

        width:
          window.innerWidth < 768
            ? canvas.getWidth() * slot.widthMobPercent
            : canvas.getWidth() * slot.widthPercent,

        fontSize:
          window.innerWidth < 768
            ? slot.mobileFontSize || 18
            : slot.fontSize || 28,
        fill: "#000000",
        fontFamily: slot.defaultFont || "Arial",

        editable: true,
        customType: "user-text",
        slotId: slot.id,
      });

      canvas.add(textbox);
    });

    canvas.renderAll();
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;

    const activeObject = canvas.getActiveObject();

    if (!activeObject) return;

    if (activeObject.customType === "frame") return;

    canvas.remove(activeObject);
    canvas.renderAll();
  };

  const exportImage = () => {
    const canvas = fabricCanvasRef.current;

    const originalVpt = canvas.viewportTransform;
    const originalZoom = canvas.getZoom();

    // temporarily reset viewport
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);

    canvas.renderAll();

    const dataURL = canvas.toDataURL({
      format: "png",
      multiplier: 5,
    });

    // restore zoom
    canvas.setViewportTransform(originalVpt);
    canvas.setZoom(originalZoom);

    canvas.renderAll();

    const link = document.createElement("a");

    link.href = dataURL;
    link.download = "photo-frame.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPreviewImage = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return "";

    const originalVpt = canvas.viewportTransform;
    const originalZoom = canvas.getZoom();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);

    canvas.renderAll();

    const url = canvas.toDataURL({
      format: "png",
      multiplier: 5,
    });

    canvas.setViewportTransform(originalVpt);
    canvas.setZoom(originalZoom);

    canvas.renderAll();

    return url;
  };
  const loadGoogleFont = (fontName) => {
    WebFont.load({
      google: {
        families: [fontName],
      },
    });
  };
  const previewImage = showPreview ? getPreviewImage() : "";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60">
      <TopHeader />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 lg:ml-[240px] flex flex-col md:flex-row">
          {/* CENTER */}
          <div
            className="
            relative
            flex-1
            flex
            flex-col
            items-center
            bg-gray-100
            overflow-hidden
            pb-20
            md:pb-0
            p-3
          "
          >
            <div
              className="
    flex-1
    flex
    items-center
    justify-center
    w-full
    overflow-hidden
    py-2
  "
            >
              <div
                ref={mobileWrapperRef}
                onPointerDown={handleMobilePointerDown}
                onPointerMove={handleMobilePointerMove}
                onPointerUp={handleMobilePointerUp}
                onPointerCancel={handleMobilePointerUp}
                className="
      relative
      w-full
      max-w-[700px]

      h-[calc(100vh-180px)]
      md:h-[700px]

      flex
      items-center
      justify-center
      mx-auto
      overflow-hidden
    "
                style={{
                  touchAction: isMobileView ? "none" : undefined,
                  transform: isMobileView
                    ? `scale(${mobileZoom}) translate(${mobileOffset.x}px, ${mobileOffset.y}px)`
                    : undefined,
                  transformOrigin: "center center",
                  willChange: isMobileView ? "transform" : undefined,
                }}
              >
                {isFrameLoading && (
  <div
    className="
      absolute
      inset-0
      z-[999]
      flex
      flex-col
      items-center
      justify-center
      gap-5

      bg-white/75
      backdrop-blur-xl

      rounded-3xl
    "
  >
    {/* Cute Premium Spinner */}
    <div className="relative">
      <div
        className="
          w-20
          h-20
          rounded-full
          border-[6px]
          border-pink-100
        "
      />

      <div
        className="
          absolute
          inset-0
          w-20
          h-20
          rounded-full

          border-[6px]
          border-transparent
          border-t-pink-500
          border-r-purple-500

          animate-spin
        "
      />
    </div>

    <div className="text-center">
      <p
        className="
          text-[17px]
          font-semibold
          bg-gradient-to-r
          from-pink-600
          to-purple-600
          bg-clip-text
          text-transparent
        "
      >
        Loading frame image for editing
      </p>

      <div className="flex justify-center gap-1 mt-2">
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
        <span
          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  </div>
)}
                <canvas
                  ref={canvasRef}
                  className="
    border
    shadow-lg
    max-w-full
    max-h-full
    touch-none
  "
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              
            </div>
            {activePanel === "elements" && (
              <div
                className="
              fixed
              bottom-28
              left-1/2
              -translate-x-1/2

              bg-white
              rounded-3xl
              shadow-xl

              p-4

              w-[85vw]
              md:w-[650px]

              h-[250px]

              overflow-y-auto

              z-[10001]
            "
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Elements</h3>

                  <button
                    onClick={() => setActivePanel(null)}
                    className="
                  w-8 h-8
                  rounded-full
                  bg-gray-100
                "
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                  {ELEMENTS.map((element) => (
                    <button
                      key={element}
                      onClick={() => {
                        addElementToCanvas(element);
                        setActivePanel(null);
                      }}
                      className="
                    aspect-square
                    border
                    rounded-xl
                    bg-white
                    p-2

                    hover:border-blue-500
                    transition
                  "
                    >
                      <img
                        src={element}
                        alt=""
                        className="
              w-full
              h-full
              object-contain
            "
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div
              className="
    fixed

    bottom-4
    md:bottom-20

    left-1/2
    md:left-[calc(50%+120px)]

    -translate-x-1/2

    flex
    items-center
    gap-2

    z-[10000]

    bg-white/90
    backdrop-blur-sm

    px-3
    py-2

    rounded-full
    shadow-xl
  "
            >
              <button
                onClick={() => {
                  addNewText();
                  setActivePanel("text");
                }}
                className="
    w-9
    h-9
    rounded-full
    bg-white
    shadow-lg
    text-2xl
  "
              >
                T
              </button>

              <label
                className="
              w-9
              h-9
              rounded-full
              bg-white
              shadow-lg

              flex
              items-center
              justify-center

              text-2xl
              cursor-pointer
              "
              >
                🖼️
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={chooseImage}
                />
              </label>

              <button
                onClick={() =>
                  setActivePanel(activePanel === "elements" ? null : "elements")
                }
                className="
              w-9
              h-9
              rounded-full
              bg-white
              shadow-lg
              text-2xl
              "
              >
                ✨
              </button>
              <button
                onClick={exportImage}
                className="
              w-9 h-9
              rounded-full
              bg-white
              shadow-lg
              text-xl
              "
              >
                ⬇️
              </button>

              <button
                onClick={deleteSelected}
                className="
            w-9 h-9
            rounded-full
            bg-white
            shadow-lg
            text-xl
            "
              >
                🗑️
              </button>
              <button
                onClick={onClose}
                className="
            w-9 h-9
            rounded-full
            bg-white
            shadow-lg
            text-xl
            "
              >
                ✕
              </button>
            </div>
          </div>
          {selectedText && (
            <div
              style={{
                left: toolbarPos.left,
                top: toolbarPos.top,
                transform: "translateX(-50%)",
              }}
              className="
            fixed
            z-[15000]

            bg-white
            rounded-full

            shadow-2xl
            border border-gray-200

            flex
            items-center
            gap-3

            px-4
            py-2
            "
            >
              <button
                onClick={() => {
                  selectedText.set(
                    "fontWeight",
                    selectedText.fontWeight === "bold" ? "normal" : "bold",
                  );

                  fabricCanvasRef.current.renderAll();
                }}
                className="
    px-3 py-1
    font-bold
    rounded
    hover:bg-gray-100
    transition
    text-sm
  "
              >
                B
              </button>
              <button
                onClick={() => {
                  selectedText.set(
                    "fontStyle",
                    selectedText.fontStyle === "italic" ? "normal" : "italic",
                  );

                  fabricCanvasRef.current.renderAll();
                }}
                className="
    px-3 py-1
    italic
    rounded
    hover:bg-gray-100
    transition
    text-sm
  "
              >
                I
              </button>
              <button
                onClick={() => {
                  selectedText.set("underline", !selectedText.underline);

                  fabricCanvasRef.current.renderAll();
                }}
                className="
    px-3 py-1
    underline
    rounded
    hover:bg-gray-100
    transition
    text-sm
  "
              >
                U
              </button>
              <input
                type="color"
                value={selectedText.fill}
                onChange={(e) => {
                  selectedText.set("fill", e.target.value);
                  fabricCanvasRef.current.renderAll();
                }}
                className="
    w-8 h-8
    border
    rounded
    cursor-pointer
  "
              />
              <select
                value={selectedFont}
                className="
    border
    border-gray-300
    rounded
    px-2
    py-1
    max-w-[140px]
    text-sm
    focus:outline-none
    focus:border-blue-500
  "
                onChange={(e) => {
                  const font = e.target.value;

                  setSelectedFont(font);

                  loadGoogleFont(font);

                  selectedText.set("fontFamily", font);

                  fabricCanvasRef.current.renderAll();
                }}
              >
                {FONTS.map((font) => (
                  <option
                    key={font}
                    value={font}
                    style={{
                      fontFamily: font,
                    }}
                  >
                    {font}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showPreview && (
            <div className="fixed inset-0 bg-black/70 z-[20000] flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg max-w-[95vw] max-h-[95vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Preview</h3>

                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Close
                  </button>
                </div>

                <div className="mb-4">
                  <input
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.1"
                    value={previewZoom}
                    onChange={(e) => setPreviewZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div
                  className="border flex items-center justify-center"
                  style={{
                    width: "80vw",
                    height: "70vh",
                    overflow: "auto",
                  }}
                >
                  <img
                    src={previewImage}
                    alt=""
                    style={{
                      maxWidth: "80vw",
                      maxHeight: "70vh",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      transform: `scale(${previewZoom})`,
                      transformOrigin: "center center",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:block">
        <BottomBar />
      </div>
    </div>
  );
}
