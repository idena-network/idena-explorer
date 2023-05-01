export default function WasmData({contractInfo, visible}) {
  return (
    <div className="section__group">
      <div className="row">
        <div className="col-12 col-sm-12">
          <div className="control-label">Code:</div>
          <div
            className="text_block"
            style={{
              wordBreak: 'break-all',
              maxHeight: '300px',
              overflowY: 'auto',
              marginRight: '5px',
            }}
          >
            {contractInfo.code}
          </div>
        </div>
      </div>
    </div>
  )
}
