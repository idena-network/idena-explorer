import {precise2} from '../../../shared/utils/utils'
import TooltipText from '../../../shared/components/tooltip'

export default function ValidationStatus({identityInfo}) {
  return (
    <div className="col-12 col-sm-6">
      <h3>Validation</h3>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">
                {(identityInfo && identityInfo.totalShortAnswers.point) || '-'}
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Total right answers (forks included)"
              >
                Right answers
              </TooltipText>
            </div>
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">
                {(identityInfo && identityInfo.totalShortAnswers.flipsCount) ||
                  '-'}
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Total flips solved (forks included)"
              >
                Solved flips
              </TooltipText>
            </div>
            <div className="col-12 col-sm-4 bordered-col">
              <h3 className="info_block__accent">
                {(identityInfo &&
                  `${precise2(
                    (identityInfo.totalShortAnswers.point /
                      identityInfo.totalShortAnswers.flipsCount) *
                      100
                  )}%`) ||
                  '-'}
              </h3>
              <div className="control-label">Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
