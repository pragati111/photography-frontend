import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import WebFont from "webfontloader";
import Sidebar from "./SideBar";
import TopHeader from "./TopHeader";
import BottomBar from "./BottomBar";

const FONTS = [
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

export default function FrameEditorMobile({ open, onClose, frameConfig }) {
  
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
  const [dragButtonPos, setDragButtonPos] = useState({
    left: 0,
    top: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [textEditorVisible, setTextEditorVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [textEditorBottom, setTextEditorBottom] = useState(12);
  const textInputRef = useRef(null);
  const initialWindowHeightRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 0);

  // Handle dragging the selected object
  useEffect(() => {
    if (!isDragging || !dragStart) return;

    const handlePointerMove = (e) => {
      const canvas = fabricCanvasRef.current;
      const obj = canvas?.getActiveObject();

      if (!obj) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      obj.set({
        left: dragStart.objLeft + deltaX,
        top: dragStart.objTop + deltaY,
      });

      // Update the drag button to follow the object on screen while dragging
      try {
        const canvasElement = canvasRef.current;
        if (canvasElement) {
          const canvasRect = canvasElement.getBoundingClientRect();
          const objRect = obj.getBoundingRect();
          const displayScale = canvasRect.width / fabricCanvasRef.current.width;

          const screenLeft = canvasRect.left + objRect.left * displayScale;
          const screenTop = canvasRect.top + objRect.top * displayScale;
          const screenWidth = objRect.width * displayScale;
          const screenHeight = objRect.height * displayScale;

          setDragButtonPos({
            left: screenLeft + screenWidth + 10,
            top: screenTop + screenHeight / 2,
          });
        }
      } catch (err) {
        // ignore positioning errors
      }

      canvas.renderAll();
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, dragStart]);

  // Show mobile text editor when a text object is selected on small screens
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (selectedText && isMobile) {
      setTextInputValue(selectedText.text || "");
      setTextEditorVisible(true);

      // focus slightly later to ensure keyboard appears
      setTimeout(() => {
        if (textInputRef.current) textInputRef.current.focus();
      }, 50);
    } else {
      setTextEditorVisible(false);
    }
  }, [selectedText]);

  // Adjust editor position to sit above mobile keyboard by listening to resize
  useEffect(() => {
    const handleResize = () => {
      const initial = initialWindowHeightRef.current || window.innerHeight;
      const diff = initial - window.innerHeight;
      const bottom = diff > 0 ? diff + 12 : 12;
      setTextEditorBottom(bottom);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    const zoom = canvas.getZoom();
    canvas.setZoom(Math.min(zoom * 1.2, 5));
  };

  const resetZoom = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);
  };
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

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 700,
      height: 700,
      preserveObjectStacking: true,
      backgroundColor: "#ffffff",
      enableRetinaScaling: true,
    });

    fabricCanvasRef.current = canvas;

    // Configure selection box styling to be darker
    fabric.Object.prototype.borderColor = "#1e40af"; // Dark blue
    fabric.Object.prototype.cornerColor = "#1e40af"; // Dark blue
    fabric.Object.prototype.cornerSize = 10;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderDashArray = [0];
    fabric.Object.prototype.borderScaleFactor = 2;

    canvas.getContext().imageSmoothingEnabled = true;
    canvas.getContext().imageSmoothingQuality = "high";

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

    // ==========================

    canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0];

      if (obj?.customType === "user-text" || obj?.customType === "user-image" || obj?.customType === "element") {
        const canvasElement = canvasRef.current;
        const canvasRect = canvasElement.getBoundingClientRect();
        
        const objRect = obj.getBoundingRect();
        
        const displayScale = canvasRect.width / fabricCanvasRef.current.width;
        
        const screenLeft = canvasRect.left + (objRect.left * displayScale);
        const screenTop = canvasRect.top + (objRect.top * displayScale);
        
        const screenWidth = objRect.width * displayScale;
        const screenHeight = objRect.height * displayScale;
        
        // Drag button positioned to the right of the selected element
        setDragButtonPos({
          left: screenLeft + screenWidth + 20,
          top: screenTop + screenHeight / 2,
        });

        if (obj?.customType === "user-text") {
          setSelectedText(obj);
          setFontSizeInput(String(obj.fontSize || ""));
          setSelectedCanvasElement(null);

          setToolbarPos({
            left: screenLeft + screenWidth / 2,
            top: screenTop + screenHeight + 12,
          });
        } else if (obj?.customType === "element" || obj?.customType === "user-image") {
          setSelectedCanvasElement(obj);
          setSelectedText(null);
        }
      } else {
        setSelectedText(null);
        setSelectedCanvasElement(null);
      }
    });

    canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0];

      if (obj?.customType === "user-text" || obj?.customType === "user-image" || obj?.customType === "element") {
        const canvasElement = canvasRef.current;
        const canvasRect = canvasElement.getBoundingClientRect();
        
        const objRect = obj.getBoundingRect();
        
        const displayScale = canvasRect.width / fabricCanvasRef.current.width;
        
        const screenLeft = canvasRect.left + (objRect.left * displayScale);
        const screenTop = canvasRect.top + (objRect.top * displayScale);
        
        const screenWidth = objRect.width * displayScale;
        const screenHeight = objRect.height * displayScale;
        
        // Drag button positioned to the right of the selected element
        setDragButtonPos({
          left: screenLeft + screenWidth + 20,
          top: screenTop + screenHeight / 2,
        });

        if (obj?.customType === "user-text") {
          setSelectedText(obj);
          setFontSizeInput(String(obj.fontSize || ""));
          setSelectedCanvasElement(null);

          setToolbarPos({
            left: screenLeft + screenWidth / 2,
            top: screenTop + screenHeight + 12,
          });
        } else if (obj?.customType === "element" || obj?.customType === "user-image") {
          setSelectedCanvasElement(obj);
          setSelectedText(null);
        }
      } else {
        setSelectedText(null);
        setSelectedCanvasElement(null);
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedText(null);
      setSelectedCanvasElement(null);
      // hide mobile text editor when selection cleared
      setTextEditorVisible(false);
    });

    loadFrame(canvas, selectedFrame);

    return () => {
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
      const isMobile = window.innerWidth < 768;

      const MAX_WIDTH = isMobile ? window.innerWidth - 10 : 600;

      const MAX_HEIGHT = isMobile ? window.innerHeight * 0.90 : 600;

      const scale = Math.min(
        MAX_WIDTH / frame.width,
        MAX_HEIGHT / frame.height,
      );

      frame.scale(scale);

      canvas.setWidth(frame.width * scale);
      canvas.setHeight(frame.height * scale);

      frame.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        customType: "frame",
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

  // Keep selected text object in sync with the text editor input
  useEffect(() => {
    if (!selectedText) return;

    // When the input value changes we update the canvas object in the onChange handler below.
    // But if external changes happen to selectedText.text, keep input in sync.
    const handleTextChange = () => {
      setTextInputValue(selectedText.text || "");
    };

    // fabric IText does not emit typical events here; poll safe fallback
    const interval = setInterval(handleTextChange, 300);

    return () => clearInterval(interval);
  }, [selectedText]);

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
    <TopHeader/>
    <div className="flex h-full">
      <Sidebar/>
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
        
        <div className="flex-1 flex items-center justify-center w-full overflow-auto">
  <div className="relative inline-block">
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
      className="border shadow-lg"
    />

    <button
      onClick={() => setShowPreview(true)}
      className="
        absolute
        top-3
        right-3

        w-10
        h-10

        rounded-full
        bg-white
        shadow-lg

        flex
        items-center
        justify-center

        z-[1000]
      "
    >
      👁️
    </button>
    

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
            <input hidden type="file" accept="image/*" onChange={chooseImage} />
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
      {(selectedText || selectedCanvasElement) && (
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            const canvas = fabricCanvasRef.current;
            const obj = canvas?.getActiveObject();
            if (obj) {
              setDragStart({
                x: e.clientX,
                y: e.clientY,
                objLeft: obj.left,
                objTop: obj.top,
              });
              setIsDragging(true);
            }
          }}
          style={{
            left: dragButtonPos.left,
            top: dragButtonPos.top,
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            boxShadow: "0 10px 20px rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.9)",
            touchAction: "none",
          }}
          className="
            fixed
            z-[15001]
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            cursor-grab
            active:cursor-grabbing
            transition-all
            duration-200
            border border-gray-200
            hover:scale-105
            active:scale-95
            group
          "
          title="Drag to move"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-blue-600 drop-shadow-sm transition-transform duration-150" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18" />
            <path d="M12 3v18" />
            <path d="M6 9L3 12L6 15" />
            <path d="M18 9L21 12L18 15" />
            <path d="M9 6L12 3L15 6" />
            <path d="M9 18L12 21L15 18" />
          </svg>
        </button>
      )}
      {selectedText && (
        <div
          style={{
            position: "fixed",
            left: toolbarPos.left,
            top: toolbarPos.top,
            transform: "translateX(-50%)",
          }}
          className="
            z-[15000]

            bg-white
            rounded-full

            shadow-xl

            flex
            items-center
            gap-2

            px-3
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
          >
            I
          </button>
          <button
            onClick={() => {
              selectedText.set("underline", !selectedText.underline);

              fabricCanvasRef.current.renderAll();
            }}
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
          />
          <select
  value={selectedFont}
  className="
    border
    rounded
    px-2
    py-1
    max-w-[120px]
    text-sm
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

      {/* Mobile inline text editor that appears above keyboard */}
      {textEditorVisible && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: textEditorBottom,
            zIndex: 20000,
            width: "calc(100% - 32px)",
            maxWidth: 700,
          }}
        >
          <div className="bg-white rounded-xl shadow-xl p-2 flex items-center gap-2">
            <textarea
              ref={textInputRef}
              value={textInputValue}
              onChange={(e) => {
                const val = e.target.value;
                setTextInputValue(val);

                // update selected canvas text in real time
                const canvas = fabricCanvasRef.current;
                if (selectedText && canvas) {
                  try {
                    selectedText.set("text", val);
                    // optional: keep caret on canvas object
                    canvas.renderAll();
                  } catch (err) {
                    // ignore
                  }
                }
              }}
              onBlur={() => {
                // keep editor visible for a short moment if user taps elsewhere
                setTimeout(() => setTextEditorVisible(false), 150);
              }}
              rows={1}
              className="w-full resize-none outline-none px-3 py-2 text-lg"
            />
            <button
              onClick={() => setTextEditorVisible(false)}
              className="text-sm text-slate-600 px-3 py-1"
            >
              Done
            </button>
          </div>
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
