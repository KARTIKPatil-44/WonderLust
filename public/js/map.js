// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Map initialization started");
  console.log("MapToken available:", !!mapToken);
  console.log("Listing data:", listing);

  // Check if mapToken is available
  if (!mapToken) {
    console.error("Mapbox token is not available");
    document.getElementById("map").innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">Map not available - Token missing</div>';
    return;
  }

  // Check if mapboxgl is available
  if (typeof mapboxgl === "undefined") {
    console.error("Mapbox GL JS is not loaded");
    document.getElementById("map").innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">Map not available - Mapbox GL JS not loaded</div>';
    return;
  }

  try {
    mapboxgl.accessToken = mapToken;

    // Check if listing and coordinates exist
    if (
      !listing ||
      !listing.geometry ||
      !listing.geometry.coordinates ||
      listing.geometry.coordinates.length === 0
    ) {
      console.error(
        "Listing coordinates not available or empty, using fallback coordinates"
      );

      // Use fallback coordinates (New York City)
      const fallbackCoords = [-74.0059945, 40.7127492];

      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: fallbackCoords,
        zoom: 14, // Increased zoom level for better detail visibility
      });

      map.addControl(new mapboxgl.NavigationControl());

      const marker = new mapboxgl.Marker({
        color: "#fe424d",
        scale: 1.2,
      })
        .setLngLat(fallbackCoords)
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            className: "custom-popup",
          }).setHTML(
            `<h4 style="color: #333; margin: 0 0 8px 0;">${
              listing ? listing.title : "Location"
            }</h4><p style="color: #666; margin: 0;">⚠️ Location not set. Please update the listing with a valid location.</p>`
          )
        )
        .addTo(map);

      map.on("load", () => {
        console.log("Map loaded with fallback coordinates");
      });
    } else {
      console.log(
        "Initializing map with coordinates:",
        listing.geometry.coordinates
      );

      // Validate coordinates format
      const coords = listing.geometry.coordinates;
      if (
        coords.length !== 2 ||
        typeof coords[0] !== "number" ||
        typeof coords[1] !== "number"
      ) {
        console.error("Invalid coordinates format:", coords);
        document.getElementById("map").innerHTML =
          '<div style="padding: 20px; text-align: center; color: #666;">Map not available - Invalid coordinates format</div>';
        return;
      }

      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coords,
        zoom: 14, // Increased zoom level for better detail visibility
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl());

      const marker = new mapboxgl.Marker({
        color: "#fe424d",
        scale: 1.2,
      })
        .setLngLat(coords)
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            className: "custom-popup",
          }).setHTML(
            `<h4 style="color: #333; margin: 0 0 8px 0;">${listing.title}</h4><p style="color: #666; margin: 0;">📍 Exact location will be provided after booking</p>`
          )
        )
        .addTo(map);

      // Add error handling for map load
      map.on("error", (e) => {
        console.error("Mapbox error:", e);
        document.getElementById("map").innerHTML =
          '<div style="padding: 20px; text-align: center; color: #666;">Error loading map: ' +
          e.error.message +
          "</div>";
      });

      map.on("load", () => {
        console.log("Map loaded successfully");

        // The streets-v12 style already shows street names and labels by default
        // No need to manually set layer properties
      });
    }
  } catch (error) {
    console.error("Error initializing map:", error);
    document.getElementById("map").innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">Error initializing map: ' +
      error.message +
      "</div>";
  }
});
