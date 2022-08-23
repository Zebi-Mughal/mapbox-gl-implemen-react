const InputLocation = ({ value, disabled, handleChange, handleSetOrigin }) => {
  return (
    <div className='origin-section'>
      <input
        placeholder='Enter address of Origin location for your route...'
        value={value}
        disabled={disabled}
        onChange={(e) =>
          handleChange((origin) => ({ ...origin, name: e.target.value }))
        }
      />
      <button disabled={disabled} onClick={() => handleSetOrigin()}>
        Set Origin
      </button>
    </div>
  )
}

export default InputLocation
