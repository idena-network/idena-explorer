import Link from 'next/link'
import {dateTimeFmt} from '../../../shared/utils/utils'

export default function ChartHeader({title, descr, actualDate}) {
  const dt = new Date(actualDate)

  console.log(actualDate, dt.toLocaleTimeString())
  return (
    <section className="section">
      <div className="section_main__group">
        <h1 className="section_main__title">{title}</h1>
        <p className="section_main__subtitle">{descr}</p>
      </div>
      <div className="button-group">
        <Link href="/charts" as="/charts">
          <a className="btn btn-secondary btn-small">
            <i className="icon icon--back" />
            <span>All stats</span>
          </a>
        </Link>
      </div>
      {actualDate && (
        <p className="control-label" position="right">
          Last update: {dateTimeFmt(actualDate)}
        </p>
      )}
    </section>
  )
}
