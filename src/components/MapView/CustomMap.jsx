const CustomMap = ({ value, mapRef }) => {
  return (
    <div className='map-cont'>
      <div className='sidebar'>
        Longitude: {value.cords[0]} | Latitude: {value.cords[1]} | Zoom:{" "}
        {value.zoom}
      </div>
      <div className='map-body'>
        <div ref={mapRef} className='map-div' />
      </div>
    </div>
  )
}

export default CustomMap
