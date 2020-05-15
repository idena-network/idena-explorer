import {useQuery} from 'react-query'
import {
  getIdentityFlipStates,
  getIdentityFlipQualifiedAnswers,
} from '../../../shared/api'
import TooltipText from '../../../shared/components/tooltip'

export default function FlipsStatus({address}) {
  const {data: identityFlipStates} = useQuery(
    ['flipStates', address],
    (_, address) => getIdentityFlipStates(address)
  )

  const {data: qualAnswers} = useQuery(
    ['flipQualifiedAnswers', address],
    (_, address) => getIdentityFlipQualifiedAnswers(address)
  )

  const count = (src, status) => {
    if (!src) {
      return '-'
    }
    return (
      src.find((x) => x.value === status) || {
        count: 0,
      }
    ).count
  }

  return (
    <div className="col-12 col-sm-6">
      <h3>Flips</h3>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">
                {(identityFlipStates &&
                  identityFlipStates.reduce(
                    (acc, cur) => acc + cur.count,
                    0
                  )) ||
                  '-'}
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Total flips created"
              >
                Total flips
              </TooltipText>
            </div>
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">
                {identityFlipStates && count(identityFlipStates, 'Qualified')} /{' '}
                {identityFlipStates &&
                  count(identityFlipStates, 'WeaklyQualified')}{' '}
                /{' '}
                {identityFlipStates &&
                  count(identityFlipStates, 'NotQualified')}
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Strong / Weak / No consensus"
              >
                Flips quality
              </TooltipText>
            </div>
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">
                {qualAnswers && count(qualAnswers, 'Inappropriate')}
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Flips with inappropriate content or irrelevant to keywords"
              >
                Reported
              </TooltipText>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
