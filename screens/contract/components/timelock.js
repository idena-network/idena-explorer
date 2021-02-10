import {useQuery} from 'react-query'
import {getTimeLockContract} from '../../../shared/api'
import {dateTimeFmt} from '../../../shared/utils/utils'

export default function TimeLockData({address}) {
  const {data: timeLockInfo} = useQuery(
    address && ['timeLock', address],
    (_, address) => getTimeLockContract(address)
  )

  return (
    <section className="section section_details">
      <h3>TimeLock details</h3>
      <div className="card">
        <div className="section__group">
          <div className="row">
            <div className="col-12 col-sm-12">
              <div className="control-label">Timestamp:</div>
              <div className="text_block">
                {timeLockInfo && dateTimeFmt(timeLockInfo.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
