// ✅ Updated: All original customizations preserved + more items/children added

export const categories = [
  {
    name: "Print & Marketing",
    children: [
      {
        name: "Business Essentials",
        items: [
          {
            id: "pm-bc-1",
            name: "Business Cards",
            image: "/images/business.jpg",
            popular: true,
            price: 499,
            originalPrice: 799,
            rating: 4.6,
            reviews: 320,

            // ✅ FIXED MEDIA
            media: [
              { type: "video", url: "/videos/demo.mp4" },
              { type: "image", url: "/images/1.jpg" },
              { type: "image", url: "/images/2.jpg" },
              { type: "image", url: "/images/3.jpg" },
              { type: "image", url: "/images/4.jpg" },
              { type: "image", url: "/images/5.jpg" },
              { type: "video", url: "/videos/demo2.mp4" },
            ],
            customizations: [
              {
                id: "size",
                label: "Card Size",
                type: "radio",
                options: ["Standard", "Square", "Mini"],
              },
              {
                id: "printType",
                label: "Printing Type",
                type: "radio",
                options: ["Single Side", "Double Side"],
              },
              {
                id: "finish",
                label: "Finish",
                type: "checkbox",
                options: ["Matte", "Glossy", "Lamination"],
              },
              {
                id: "quantity",
                label: "Select Quantity",
                type: "dropdown",
                options: ["100", "200", "500", "1000"],
              },
              {
                id: "name",
                label: "Name to Print",
                type: "text",
                placeholder: "Enter your name",
              },
              {
                id: "notes",
                label: "Instructions",
                type: "textarea",
                placeholder: "Any special request...",
              },
              {
                id: "frontDesign",
                label: "Upload Front Design",
                type: "file",
              },
              {
                id: "backDesign",
                label: "Upload Back Design",
                type: "file",
                showIf: {
                  field: "printType",
                  value: "Double Side",
                },
              },
            ],
          },
          {
            id: "pm-lh-1",
            name: "Letterheads",
            image: "/images/2.jpg",
            price: 699,
            customizations: [
              { id: "paperType", label: "Paper Type", type: "radio", options: ["Matte", "Glossy"] }
            ]
          },
          {
            id: "pm-env-1",
            name: "Envelopes",
            image: "/images/3.jpg",
            price: 299,
            customizations: [
              { id: "size", label: "Size", type: "dropdown", options: ["A4", "A5", "DL"] }
            ]
          },
          {
            id: "pm-np-1",
            name: "Notepads",
            image: "/images/4.jpg",
            price: 199,
            customizations: [
              { id: "pages", label: "Pages", type: "dropdown", options: ["50", "100", "200"] }
            ]
          }
        ]
      },
      {
        name: "Marketing Materials",
        items: [
          {
            id: "pm-fly-1",
            name: "Flyers",
            image: "/images/5.jpg",
            price: 399,
            customizations: [
              { id: "size", label: "Size", type: "radio", options: ["A4", "A5"] }
            ]
          },
          {
            id: "pm-bro-1",
            name: "Brochures",
            image: "/images/6.jpg",
            price: 799,
            customizations: [
              { id: "fold", label: "Fold Type", type: "radio", options: ["Bi-Fold", "Tri-Fold"] }
            ]
          },
          {
            id: "pm-pos-1",
            name: "Posters",
            image: "/images/7.jpg",
            price: 199,
            customizations: [
              { id: "size", label: "Poster Size", type: "radio", options: ["A3", "A2"] }
            ]
          },
          {
            id: "pm-ban-1",
            name: "Banners",
            image: "/images/1.jpg",
            price: 999,
            customizations: [
              { id: "material", label: "Material", type: "dropdown", options: ["Flex", "Vinyl"] }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "Fashion & Textile",
    children: [
      {
        name: "Clothing",
        items: [
          {
            id: "ft-tsh-1",
            name: "Custom T-Shirts",
            image: "/images/2.jpg",
            price: 999,
            customizations: [
              { id: "size", label: "Size", type: "dropdown", options: ["S", "M", "L", "XL"] }
            ]
          },
          {
            id: "ft-cap-1",
            name: "Caps",
            image: "/images/3.jpg",
            price: 299,
            customizations: [
              { id: "color", label: "Color", type: "radio", options: ["Black", "Red", "Blue"] }
            ]
          },
          {
            id: "ft-hod-1",
            name: "Hoodies",
            image: "/images/4.jpg",
            price: 1499,
            customizations: [
              { id: "size", label: "Size", type: "dropdown", options: ["M", "L", "XL"] }
            ]
          }
        ]
      }
    ]
  }
,

  {
    name: "Electronics & Accessories",
    children: [
      {
        name: "Mobile Accessories",
        items: [
          { id: "ea-chg-1", name: "Chargers", image: "/images/1.jpg", price: 299, customizations: [{ id: "type", label: "Type", type: "radio", options: ["Fast", "Normal"] }] },
          { id: "ea-cbl-1", name: "Cables", image: "/images/2.jpg", price: 149, customizations: [{ id: "length", label: "Length", type: "dropdown", options: ["1m", "2m"] }] },
          { id: "ea-hph-1", name: "Headphones", image: "/images/3.jpg", price: 999, customizations: [{ id: "mode", label: "Mode", type: "radio", options: ["Wired", "Wireless"] }] },
          { id: "ea-pbk-1", name: "Power Banks", image: "/images/4.jpg", price: 1299, customizations: [{ id: "capacity", label: "Capacity", type: "dropdown", options: ["10000mAh", "20000mAh"] }] }
        ]
      }
    ]
  },

  {
    name: "Stationery",
    children: [
      {
        name: "Office Supplies",
        items: [
          { id: "st-pen-1", name: "Pens", image: "/images/5.jpg", price: 49, customizations: [{ id: "ink", label: "Ink Color", type: "radio", options: ["Blue", "Black"] }] },
          { id: "st-not-1", name: "Notebooks", image: "/images/6.jpg", price: 199, customizations: [{ id: "pages", label: "Pages", type: "dropdown", options: ["100", "200"] }] },
          { id: "st-mar-1", name: "Markers", image: "/images/7.jpg", price: 99, customizations: [{ id: "type", label: "Type", type: "radio", options: ["Permanent", "Whiteboard"] }] },
          { id: "st-fil-1", name: "Files & Folders", image: "/images/1.jpg", price: 149, customizations: [{ id: "size", label: "Size", type: "dropdown", options: ["A4", "A5"] }] }
        ]
      }
    ]
  },

  {
    name: "Sports & Fitness",
    children: [
      {
        name: "Fitness Gear",
        items: [
          { id: "sf-ym-1", name: "Yoga Mats", image: "/images/2.jpg", price: 799, customizations: [{ id: "thickness", label: "Thickness", type: "dropdown", options: ["6mm", "8mm"] }] },
          { id: "sf-db-1", name: "Dumbbells", image: "/images/3.jpg", price: 999, customizations: [{ id: "weight", label: "Weight", type: "dropdown", options: ["5kg", "10kg"] }] },
          { id: "sf-rp-1", name: "Skipping Ropes", image: "/images/4.jpg", price: 199, customizations: [{ id: "type", label: "Type", type: "radio", options: ["Speed", "Weighted"] }] },
          { id: "sf-glv-1", name: "Gym Gloves", image: "/images/5.jpg", price: 299, customizations: [{ id: "size", label: "Size", type: "dropdown", options: ["M", "L"] }] }
        ]
      }
    ]
  },

  {
    name: "Automotive",
    children: [
      {
        name: "Car Accessories",
        items: [
          { id: "au-fmt-1", name: "Floor Mats", image: "/images/6.jpg", price: 1499, customizations: [{ id: "material", label: "Material", type: "radio", options: ["Rubber", "Fabric"] }] },
          { id: "au-cvr-1", name: "Car Covers", image: "/images/7.jpg", price: 999, customizations: [{ id: "size", label: "Size", type: "dropdown", options: ["Hatchback", "SUV"] }] },
          { id: "au-prf-1", name: "Car Perfumes", image: "/images/1.jpg", price: 199, customizations: [{ id: "fragrance", label: "Fragrance", type: "dropdown", options: ["Citrus", "Ocean"] }] },
          { id: "au-mnt-1", name: "Mobile Mounts", image: "/images/2.jpg", price: 299, customizations: [{ id: "mountType", label: "Mount Type", type: "radio", options: ["Dashboard", "AC Vent"] }] }
        ]
      }
    ]
  },

  {
    name: "Books & Media",
    children: [
      {
        name: "Books",
        items: [
          { id: "bm-nov-1", name: "Novels", image: "/images/3.jpg", price: 399, customizations: [{ id: "format", label: "Format", type: "radio", options: ["Paperback", "Hardcover"] }] },
          { id: "bm-edu-1", name: "Educational Books", image: "/images/4.jpg", price: 599, customizations: [{ id: "level", label: "Level", type: "dropdown", options: ["School", "College"] }] },
          { id: "bm-com-1", name: "Comics", image: "/images/5.jpg", price: 199, customizations: [{ id: "age", label: "Age Group", type: "dropdown", options: ["Kids", "Teens"] }] },
          { id: "bm-mag-1", name: "Magazines", image: "/images/6.jpg", price: 149, customizations: [{ id: "frequency", label: "Frequency", type: "radio", options: ["Monthly", "Weekly"] }] }
        ]
      }
    ]
  }
];