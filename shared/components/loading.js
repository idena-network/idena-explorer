export function PageLoading() {
  return (
    <section className="section section_main">
      <div className="row">
        <div className="col-12 col-sm-12">
          <span>Page is loading...</span>
        </div>
      </div>
    </section>
  )
}

export function PageError() {
  return (
    <section className="section section_main">
      <div className="row">
        <div className="col-12 col-sm-12">
          <span>An error occured, please try again</span>
        </div>
      </div>
    </section>
  )
}
