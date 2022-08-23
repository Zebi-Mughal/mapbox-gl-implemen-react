const FilePicker = ({ loading, onFileCapture }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <p>{`Select a file (.csv) with list of addresses to view them on the map above`}</p>
      <input
        type='file'
        id='csvFile'
        accept='.csv'
        disabled={loading}
        onChange={(e) => onFileCapture(e.target.files[0])}
      />
    </div>
  )
}

export default FilePicker
