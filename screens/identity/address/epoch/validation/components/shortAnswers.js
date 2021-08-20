import {useQuery} from 'react-query'
import Link from 'next/link'
import {getIdentityShortAnswersByEpoch} from '../../../../../../shared/api'
import TooltipText from '../../../../../../shared/components/tooltip'
import {SkeletonRows} from '../../../../../../shared/components/skeleton'

export default function ShortAnswers({address, epoch, visible}) {
  const {data: answers, status} = useQuery(
    address &&
      epoch > 0 &&
      visible && ['epoch/identity/shortAnswers', address, epoch - 1],
    (_, address, epoch) => getIdentityShortAnswersByEpoch(address, epoch)
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th style={{width: 300}}>Flip</th>
            <th>
              <TooltipText tooltip="Answer agreed by qualification committee">
                Correct
                <br />
                answer
              </TooltipText>
            </th>
            <th>
              <TooltipText tooltip="Qualification committee consensus about the correct answer">
                Consensus
              </TooltipText>
            </th>
            <th>Answer</th>
            <th>Score</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={6} />)}
          {answers &&
            answers.map((item) => {
              let ico = item.respAnswer === 'None' ? '' : 'icon--micro_fail'
              let score = 0

              if (item.flipWrongWords) {
                score = '-'
                ico = ''
              } else if (item.flipStatus === 'Qualified') {
                if (item.flipAnswer === item.respAnswer) {
                  score = 1
                  ico = 'icon--micro_success'
                }
              } else if (item.flipStatus === 'WeaklyQualified') {
                if (item.flipAnswer === item.respAnswer) {
                  score = 1
                  ico = 'icon--micro_success'
                } else if (item.respAnswer !== 'None') {
                  score = 0.5
                  ico = ''
                } else {
                  score = '-'
                  ico = ''
                }
              } else {
                score = '-'
                ico = ''
              }
              return (
                <tr>
                  <td>
                    <div className="user-pic">
                      <img
                        src="/static/images/flip_icn.png"
                        alt="pic"
                        width="44"
                        height="44"
                      />
                    </div>
                    <div
                      className="text_block text_block--ellipsis"
                      style={{width: 300}}
                    >
                      <Link href="/flip/[cid]" as={`/flip/${item.cid}`}>
                        <a>{item.cid}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{item.flipAnswer === 'None' ? '-' : item.flipAnswer}</td>
                  <td>
                    {item.flipWrongWords
                      ? 'Reported'
                      : item.flipStatus === 'Qualified'
                      ? 'Strong'
                      : item.flipStatus === 'WeaklyQualified'
                      ? 'Weak'
                      : 'No consensus'}
                  </td>
                  <td>
                    {' '}
                    <i className={`icon ${ico}`} />
                    {item.respAnswer === 'None' ? '-' : item.respAnswer}
                  </td>
                  <td>{score}</td>
                  <td> </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
