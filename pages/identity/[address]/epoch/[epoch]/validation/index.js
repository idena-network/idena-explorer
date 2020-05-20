import Link from 'next/link'
import {NavItem, NavLink, TabPane, TabContent} from 'reactstrap'
import {useQuery} from 'react-query'
import Layout from '../../../../../../shared/components/layout'
import {getIdentityByEpoch} from '../../../../../../shared/api'
import {
  identityStatusFmt,
  epochFmt,
  precise1,
  isIdentityPassed,
} from '../../../../../../shared/utils/utils'
import TooltipText from '../../../../../../shared/components/tooltip'
import ShortAnswers from './components/shortAnswers'
import LongAnswers from './components/longAnswers'
import {
  useHash,
  useHashChange,
} from '../../../../../../shared/utils/useHashChange'

const DEFAULT_TAB = '#shortAnswers'

function Validation({address = '', epoch}) {
  const {hash, setHash, hashReady} = useHash()
  useHashChange((hash) => setHash(hash))

  // eslint-disable-next-line no-param-reassign
  epoch = parseInt(epoch)

  const {data: identity} = useQuery(
    ['epoch/identity', address, epoch - 1],
    (_, address, epoch) => getIdentityByEpoch(address, epoch)
  )

  return (
    <Layout
      title={`Identity validation ${address} for epoch ${epochFmt(epoch)}`}
    >
      <section className="section section_main">
        <div className="row">
          <div className="col-auto">
            <div className="section_main__image">
              <img
                src={`https://robohash.org/${address.toLowerCase()}`}
                alt="pic"
                width="160"
              />
              <div className="verified_sign">
                {identity && identity.state === 'Human' && (
                  <i className="icon icon--status" />
                )}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="section_main__group">
              <h1 className="section_main__title">
                <span>Identity validation for epoch </span>
                <span>{epochFmt(epoch)}</span>
              </h1>
              <h3 className="section_main__subtitle">{address}</h3>

              <h3 className="section_main__subtitle">
                {identity
                  ? isIdentityPassed(identity.state)
                    ? 'Successful validation'
                    : 'Validation failed'
                  : '-'}
              </h3>
            </div>

            <div className="button-group">
              <Link
                href="/identity/[address]/epoch/[epoch]/rewards"
                as={`/identity/${address}/epoch/${epoch}/rewards`}
              >
                <a className="btn btn-small btn-secondary">
                  <i className="icon icon--coins" />
                  <span>Validation rewards</span>
                </a>
              </Link>

              <Link href="/address/[address]" as={`/address/${address}`}>
                <a className="btn btn-small btn-secondary">
                  <i className="icon icon--coins" />
                  <span>Address details</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AnswersData identity={identity} address={address} epoch={epoch} />

      <section className="section section_tabs">
        <div className="tabs">
          <div className="section__header">
            <div className="row align-items-center justify-content-between">
              <div className="col">
                <ul className="nav nav-tabs" role="tablist">
                  <NavItem>
                    <NavLink
                      active={hashReady && (hash === DEFAULT_TAB || !hash)}
                      href={DEFAULT_TAB}
                    >
                      <h3>Validation answers</h3>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={hashReady && hash === '#longAnswers'}
                      href="#longAnswers"
                    >
                      <h3>Qualification answers</h3>
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
            </div>
          </div>

          <TabContent activeTab={hashReady ? hash || DEFAULT_TAB : ''}>
            <TabPane tabId={DEFAULT_TAB}>
              <div className="card">
                <ShortAnswers
                  address={address}
                  epoch={epoch}
                  visible={hashReady && (hash === DEFAULT_TAB || !hash)}
                />
              </div>
            </TabPane>
            <TabPane tabId="#longAnswers">
              <div className="card">
                <LongAnswers
                  address={address}
                  epoch={epoch}
                  visible={hashReady && hash === '#longAnswers'}
                />
              </div>
            </TabPane>
          </TabContent>
        </div>
      </section>
    </Layout>
  )
}

function AnswersData({address, epoch, identity}) {
  let result = '-'
  let shortInTime = '-'
  let longInTime = '-'
  const redColorStle = {color: 'red'}

  const shortScore =
    identity &&
    identity.shortAnswers.flipsCount &&
    (identity.shortAnswers.point / identity.shortAnswers.flipsCount) * 100
  const longScore =
    identity &&
    identity.longAnswers.flipsCount &&
    (identity.longAnswers.point / identity.longAnswers.flipsCount) * 100
  const totalScore =
    identity &&
    identity.totalShortAnswers.flipsCount &&
    (identity.totalShortAnswers.point / identity.totalShortAnswers.flipsCount) *
      100

  if (identity) {
    if (identity.missed) {
      if (identity.shortAnswersCount) {
        result = 'Late submission'
        shortInTime = 'Late'
      } else {
        result = 'Missed validation'
        if (identity.approved) {
          shortInTime = 'No answers'
        } else {
          shortInTime = 'Missing'
        }
      }

      if (identity.longAnswers.flipsCount) {
        longInTime = 'In time'
      } else {
        longInTime = 'Missing'
      }
    } else if (
      identity.state === 'Newbie' ||
      identity.state === 'Verified' ||
      identity.state === 'Human'
    ) {
      result = 'Successful'
      shortInTime = 'In time'
      longInTime = 'In time'
    } else {
      result = 'Wrong answers'
      shortInTime = 'In time'
      longInTime = 'In time'
    }
  }

  console.log(longInTime === 'In time')
  return (
    <>
      <section className="section section_details">
        <h3>Details</h3>
        <div className="card">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Identity:</div>
                <div
                  className="text_block text_block--ellipsis"
                  style={{width: '80%'}}
                >
                  <Link href="/identity/[address]" as={`/identity/${address}`}>
                    <a>{address}</a>
                  </Link>
                </div>
                <hr />

                <div className="control-label">Status:</div>
                <div className="text_block">
                  {(identity && identityStatusFmt(identity.state)) || '-'}
                </div>
                <hr />

                <div className="control-label">Validation result:</div>
                <div className="text_block">{result}</div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">
                  Validation results for epoch:
                </div>
                <div className="text_block">
                  <Link
                    href="/epoch/[epoch]/validation"
                    as={`/epoch/${epoch}/validation`}
                  >
                    <a>{epochFmt(epoch)}</a>
                  </Link>
                </div>
                <hr />

                <div className="control-label">
                  Status before the validation:
                </div>
                <div className="text_block">
                  {(identity && identityStatusFmt(identity.prevState)) || '-'}
                </div>
                <hr />

                <div className="control-label">Allowed for validation:</div>
                <div className="text_block">
                  {(identity &&
                    (identity.prevState === 'Invite'
                      ? 'No (invitation is not activated)'
                      : identity.madeFlips >= identity.requiredFlips
                      ? 'Yes'
                      : `No (flips are missing: ${identity.madeFlips} out of ${identity.requiredFlips})`)) ||
                    '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12 col-sm-9">
            <div className="row">
              <div className="col-12 col-sm-6">
                <h3>Validation answers</h3>
                <div className="card">
                  <div className="info_block">
                    <div className="row">
                      <div className="col-12 col-sm-8 bordered-col">
                        <h3
                          className="info_block__accent"
                          style={{
                            color: `${
                              shortScore && shortScore < 60 ? 'red' : 'inherit'
                            }`,
                          }}
                        >
                          {(shortScore &&
                            `${precise1(shortScore)}%                           
                            (${identity && identity.shortAnswers.point}/${
                              identity && identity.shortAnswers.flipsCount
                            })`) ||
                            '-'}
                        </h3>
                        <TooltipText
                          data-toggle="tooltip"
                          className="control-label"
                          tooltip="Short session score (Right&nbsp;answers/Solved) Min.&nbsp;score&nbsp;required:&nbsp;60%"
                        >
                          Score
                        </TooltipText>
                      </div>

                      <div className="col-12 col-sm-4 bordered-col">
                        <h3
                          className="info_block__accent"
                          style={{
                            color: `${
                              shortInTime === 'In time' ? 'inherit' : 'red'
                            }`,
                          }}
                        >
                          {shortInTime}
                        </h3>
                        <TooltipText
                          data-toggle="tooltip"
                          className="control-label"
                          tooltip="Whether the answers submitted in time or not"
                        >
                          Submission
                        </TooltipText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <h3>Qualification answers</h3>
                <div className="card">
                  <div className="info_block">
                    <div className="row">
                      <div className="col-12 col-sm-8 bordered-col">
                        <h3
                          className="info_block__accent"
                          style={{
                            color: `${
                              longScore && longScore < 75 ? 'red' : 'inherit'
                            }`,
                          }}
                        >
                          {(longScore &&
                            `${precise1(longScore)}%
                           (${identity && identity.longAnswers.point}/${
                              identity && identity.longAnswers.flipsCount
                            })`) ||
                            '-'}
                        </h3>
                        <TooltipText
                          data-toggle="tooltip"
                          className="control-label"
                          tooltip="Long session score (Right&nbsp;answers/Solved) Min.&nbsp;score&nbsp;required:&nbsp;75%"
                        >
                          Score
                        </TooltipText>
                      </div>

                      <div className="col-12 col-sm-4 bordered-col">
                        <h3
                          className="info_block__accent"
                          style={{
                            color: `${
                              longInTime === 'In time' ? 'inherit' : 'red'
                            }`,
                          }}
                        >
                          {longInTime}
                        </h3>
                        <TooltipText
                          data-toggle="tooltip"
                          className="control-label"
                          tooltip="Whether the answers submitted in time or not"
                        >
                          Submission
                        </TooltipText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-3">
            <h3>Total score</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-12 bordered-col">
                    <h3
                      className="info_block__accent"
                      style={{
                        color: `${
                          totalScore && totalScore < 75 ? 'red' : 'inherit'
                        }`,
                      }}
                    >
                      {(totalScore &&
                        `${precise1(totalScore)}% (${
                          identity && identity.totalShortAnswers.point
                        }/${
                          identity && identity.totalShortAnswers.flipsCount
                        })`) ||
                        '-'}
                    </h3>
                    <TooltipText
                      data-toggle="tooltip"
                      className="control-label"
                      tooltip="Total score for all epochs (Right&nbsp;answers/Solved) Min.&nbsp;score&nbsp;required:&nbsp;75%"
                    >
                      Score
                    </TooltipText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

Validation.getInitialProps = function ({query}) {
  return {address: query.address, epoch: query.epoch}
}

export default Validation
