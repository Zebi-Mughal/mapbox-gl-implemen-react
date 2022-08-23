import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "!mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import { getCoordinates, getRoute } from "../services/MapBox"
import {
  InputLocation,
  CustomMap,
  AddressList,
  FilePicker
} from "../components/MapView"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const MapView = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  const [controller, setController] = useState({
    cords: [74.2920849, 31.4524496],
    zoom: 10
  })
  const [addressList, setAddressList] = useState(null)
  const [addressLoading, setAddressLoading] = useState(false)
  const [pointers, setPointers] = useState([])
  const [dest, setDest] = useState(-1)
  const [origin, setOrigin] = useState({ name: "", cords: null })
  const [currentOriginMarker, setCurrentOriginMarker] = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)

  //To initialize map
  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: controller.cords,
      zoom: controller.zoom
    })
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  // Set values of Lat,Long and zoom to display on sidebar
  useEffect(() => {
    if (!map.current) return
    map.current.on("move", () => {
      const long = map.current.getCenter().lng.toFixed(4)
      const lat = map.current.getCenter().lat.toFixed(4)
      const zoom = map.current.getZoom().toFixed(2)
      setController({ cords: [long, lat], zoom: zoom })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  // Convert uploaded csv addresses to coordinates
  useEffect(() => {
    if (addressList?.length > 0) {
      handleAddressToCords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressList])

  // Plot the coordinates of uploaded csv to the map
  useEffect(() => {
    if (pointers.length > 0) {
      handlePlotPointers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointers])

  // Focus on selected marker from address list
  useEffect(() => {
    if (pointers.length > 0) {
      map.current.setCenter(pointers[dest])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointers, dest])

  // Add route from user's entered location to selected destination
  useEffect(() => {
    if (origin.cords) {
      map.current.setCenter(origin.cords)
      handleMapRoute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin.cords, dest])

  const handleAddressToCords = () => {
    setAddressLoading(true)
    let list = []
    addressList.forEach(async (address, i) => {
      const res = await getCoordinates(address)
      if (res.success) {
        list.push(res.data?.features[0]?.geometry?.coordinates)
      }

      if (i === addressList.length - 1) {
        setPointers(list)
        setDest(0)
      }
    })
    setAddressLoading(false)
  }

  const handlePlotPointers = () => {
    pointers.forEach((coordinates) => {
      new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current)
    })
  }

  const handleSetOrigin = async () => {
    setRouteLoading(true)
    const res = await getCoordinates(origin.name)
    if (res.success) {
      const cords = res.data.features[0].geometry.coordinates
      setOrigin((origin) => ({ ...origin, cords: cords }))
      if (currentOriginMarker) {
        currentOriginMarker.remove()
      }
      const marker = new mapboxgl.Marker({ color: "#b40219" })
        .setLngLat(cords)
        .addTo(map.current)

      setCurrentOriginMarker(marker)
    } else {
      alert("Invalid Address")
      setRouteLoading(false)
    }
  }

  const handleMapRoute = async () => {
    const routeRes = await getRoute(origin.cords, pointers[dest])
    if (routeRes.success) {
      const route = routeRes.data.routes[0].geometry.coordinates

      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route
        }
      }

      if (map.current.getSource("route")) {
        map.current.getSource("route").setData(geojson)
      } else {
        map.current.addLayer({
          id: `route`,
          type: "line",
          source: {
            type: "geojson",
            data: geojson
          },
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75
          }
        })
      }
    } else {
      alert("Could not find route")
    }
    setRouteLoading(false)
  }

  const handleFileSelect = (file) => {
    if (file.type === "text/csv") {
      const reader = new FileReader()

      reader.onload = function (e) {
        let text = e.target.result
        text = text.replaceAll('"', "").split("\n")
        let list = []
        text.forEach((elem) => {
          list.push(elem.replaceAll("\r", ""))
        })
        if (list.length > 0) {
          setAddressList(list)
        }
      }

      reader.readAsText(file)
    } else {
      alert("Invalid File type selected")
    }
  }

  return (
    <div>
      <h2>Map View App</h2>

      {addressList && addressList.length > 0 && (
        <InputLocation
          value={origin.name}
          disabled={routeLoading}
          handleChange={setOrigin}
          handleSetOrigin={handleSetOrigin}
        />
      )}

      <div className='map-view-body'>
        <CustomMap value={controller} mapRef={mapContainer} />
        <div className='address-cont'>
          <AddressList
            data={addressList}
            loading={addressLoading}
            dest={dest}
            setDest={setDest}
          />
          <FilePicker
            loading={addressLoading}
            onFileCapture={handleFileSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default MapView
