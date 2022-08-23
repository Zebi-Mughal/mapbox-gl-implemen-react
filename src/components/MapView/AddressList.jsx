const AddressList = ({ data, loading, dest, setDest }) => {
  return (
    <div>
      {data?.length > 0 ? (
        <>
          <h2>List of Locations</h2>
          {data.map((elem, i) => (
            <div
              key={elem}
              className='address-list'
              style={{ backgroundColor: i === dest ? "burlywood" : "" }}
              onClick={() => setDest(i)}
            >
              <span>{elem}</span>
            </div>
          ))}
        </>
      ) : (
        loading && (
          <div>
            <img src='./loader.gif' alt='Address List Loading' />
          </div>
        )
      )}
    </div>
  )
}

export default AddressList
