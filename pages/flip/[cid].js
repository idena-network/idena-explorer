import Layout from '../../shared/components/layout';
import {
  getFlip,
  getFlipContent,
  getAdjacentFlips,
  getFlipShortAnswers,
  getFlipLongAnswers,
  getIdentityByEpoch,
} from '../../shared/api';
import { useQuery } from 'react-query';
import Link from 'next/link';
import {
  epochFmt,
  dateTimeFmt,
  identityStatusFmt,
} from '../../shared/utils/utils';
import TooltipText from '../../shared/components/tooltip';

function Flip({ cid }) {
  const { data: flip } = useQuery(['flip', cid], (_, cid) => getFlip(cid));

  const { data: flipContent } = useQuery(['flipContent', cid], (_, cid) =>
    getFlipContent(cid)
  );

  const { data: adjacentFlips } = useQuery(['adjacentFlips', cid], (_, cid) =>
    getAdjacentFlips(cid)
  );

  const { data: shortAnswers } = useQuery(['shortAnswers', cid], (_, cid) =>
    getFlipShortAnswers(cid)
  );

  const { data: longAnswers } = useQuery(['longAnswers', cid], (_, cid) =>
    getFlipLongAnswers(cid)
  );

  const epoch = flip ? flip.epoch : 0;

  const prevCid =
    adjacentFlips && adjacentFlips.prev && adjacentFlips.prev.value;

  const nextCid =
    adjacentFlips && adjacentFlips.next && adjacentFlips.next.value;

  const positions = getImagesPositions(flipContent);

  return (
    <Layout>
      <section className="section">
        <div className="section_main__group">
          <h1 className="section_main__title">
            Flip{' '}
            {flipContent && !flipContent.LeftOrder ? '(encrypted content)' : ''}
          </h1>
          <h3 className="section_main__subtitle">{cid}</h3>
        </div>

        <div className="button-group">
          <Link href="/flip/[cid]" as={`/flip/${prevCid}`}>
            <a className="btn btn-secondary btn-small" disabled={!prevCid}>
              <i className="icon icon--thin_arrow_left"></i>
              <span>Previous flip</span>
            </a>
          </Link>

          <Link href="/flip/[cid]" as={`/flip/${nextCid}`}>
            <a className="btn btn-secondary btn-small" disabled={!nextCid}>
              <span>Next flip</span>
              <i className="icon icon--thin_arrow_right"></i>
            </a>
          </Link>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12 col-sm-4">
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <div className="col-12 col-sm-6" style={{ flex: '0 0 0' }}>
                <div className="flipframe">
                  <div>
                    <img
                      src={positions.L0 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                      className="fliptopimage"
                    />
                  </div>
                  <div>
                    <img
                      src={positions.L1 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                    />
                  </div>
                  <div>
                    <img
                      src={positions.L2 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                    />
                  </div>
                  <div>
                    <img
                      src={positions.L3 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                      className="flipbottomimage"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6" style={{ flex: '0 0 0' }}>
                <div className="flipframe">
                  <div>
                    <img
                      src={positions.R0 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                      className="fliptopimage"
                    />
                  </div>
                  <div>
                    <img
                      src={positions.R1 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                    />
                  </div>
                  <div>
                    <img
                      src={positions.R2 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                    />
                  </div>
                  <div>
                    <img
                      src={positions.R3 || '/static/images/flip_icn@2x.png'}
                      alt="pic"
                      className="flipbottomimage"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div>
              <div className="flipkeywordsframe">
                <div className="flipkeywords">
                  <p className="text_block font-weight-bold capitalize">
                    {flip && flip.words ? flip.words.word1.name : ''}
                  </p>
                  <br />
                  <p className="text_block text-grey">
                    {flip
                      ? flip.words
                        ? flip.words.word1.desc
                        : 'No keywords available'
                      : '-'}
                  </p>
                  <br />
                  <br />
                  <p className="text_block font-weight-bold capitalize">
                    {flip && flip.words ? flip.words.word2.name : ''}
                  </p>
                  <br />
                  <p className="text_block text-grey">
                    {flip
                      ? flip.words
                        ? flip.words.word2.desc
                        : 'No keywords available'
                      : '-'}
                  </p>
                </div>

                <br />
                {flip && flip.words && (
                  <p className="text_block">
                    <i
                      className={
                        flip.wrongWords || flip.status === 'QualifiedByNone'
                          ? 'icon icon--micro_fail'
                          : 'icon icon--micro_success'
                      }
                    ></i>
                    {flip.wrongWords || flip.status === 'QualifiedByNone'
                      ? flip.status === 'QualifiedByNone'
                        ? 'The flip was not available for the network during the validation'
                        : 'The flip was reported as irrelevant to keywords or having inappropriate content, labels on top of the images showing the right order or text needed to solve the flip'
                      : 'Flip is relevant to the keywords'}
                  </p>
                )}
                {flip && !flip.words && (
                  <p className="text_block">
                    <i className="icon icon--micro_fail"></i>
                    {
                      'The flip was reported as having inappropriate content, labels on top of the images showing the right order or text needed to solve the flip'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_details">
        <h3>Details</h3>
        <div className="card">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Author:</div>
                <div
                  className="text_block text_block--ellipsis"
                  style={{ width: '80%' }}
                >
                  {flip ? (
                    <Link
                      href="/identity/[address]"
                      as={'/identity/' + flip.author}
                    >
                      <a>
                        <img
                          className="user-pic"
                          width="32"
                          src={
                            'https://robohash.org/' + flip.author.toLowerCase()
                          }
                        ></img>
                        <span>{flip.author}</span>
                      </a>
                    </Link>
                  ) : (
                    '-'
                  )}
                </div>
                <hr />

                <div className="control-label">Epoch:</div>
                <div className="text_block">
                  {flip ? (
                    <Link href="/epoch/[epoch]" as={'/epoch/' + flip.epoch}>
                      <a>{epochFmt(flip.epoch)}</a>
                    </Link>
                  ) : (
                    '-'
                  )}
                </div>

                <hr />
                <div className="control-label">Size:</div>
                <div className="text_block">
                  {(flip && flip.size) || '-'} bytes
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="section__group">
                <div className="control-label">Created:</div>
                <div className="text_block">
                  {(flip && dateTimeFmt(flip.timestamp)) || '-'}
                </div>
                <hr />
                <div className="control-label">Block:</div>
                <div className="text_block">
                  {flip ? (
                    <Link
                      href="/block/[block]"
                      as={'/block/' + flip.blockHeight}
                    >
                      <a>{flip.blockHeight}</a>
                    </Link>
                  ) : (
                    '-'
                  )}
                </div>
                <hr />
                <div className="control-label">Tx:</div>
                <div
                  className="text_block text_block--ellipsis"
                  style={{ width: '80%' }}
                >
                  {flip ? (
                    <Link
                      href="/transaction/[hash]"
                      as={'/transaction/' + flip.txHash}
                    >
                      <a>{flip.txHash}</a>
                    </Link>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12 col-sm-6">
            <h3>Agreed answer</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-6 bordered-col">
                    <h3 className="info_block__accent">
                      {flip &&
                      (flip.status === 'Qualified' ||
                        flip.status === 'WeaklyQualified')
                        ? flip.answer
                        : '-'}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Answer agreed by qualification committee"
                    >
                      Answer
                    </TooltipText>
                  </div>
                  <div className="col-12 col-sm-6 bordered-col">
                    <h3 className="info_block__accent">
                      {flip && flip.status === 'Qualified' ? 'Strong' : ''}
                      {flip && flip.status === 'WeaklyQualified' ? 'Weak' : ''}
                      {flip &&
                      flip.status !== 'Qualified' &&
                      flip.status !== 'WeaklyQualified'
                        ? 'No consensus'
                        : ''}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Qualification committee consensus"
                    >
                      Consensus
                    </TooltipText>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <h3>Votes</h3>
            <div className="card">
              <div className="info_block">
                <div className="row">
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent">
                      {(longAnswers &&
                        longAnswers.filter((x) => x.respAnswer === 'Left')
                          .length) ||
                        '-'}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Votes for Left answer"
                    >
                      Left
                    </TooltipText>
                  </div>
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent">
                      {(longAnswers &&
                        longAnswers.filter((x) => x.respAnswer === 'Right')
                          .length) ||
                        '-'}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Votes for Right answer"
                    >
                      Right
                    </TooltipText>
                  </div>
                  <div className="col-12 col-sm-4 bordered-col">
                    <h3 className="info_block__accent">
                      {flip ? flip.wrongWordsVotes : '-'}
                    </h3>
                    <TooltipText
                      className="control-label"
                      data-toggle="tooltip"
                      tooltip="Bad flip reported"
                    >
                      Reported
                    </TooltipText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12">
            <h3>Qualification committee</h3>
            <div class="card">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Identity</th>
                      <th style={{ width: 190 }}>
                        <TooltipText tooltip="Identity status before the validation">
                          Status
                        </TooltipText>
                      </th>
                      <th style={{ width: 140 }}>
                        <TooltipText tooltip="Answer given on qualification session">
                          Answer
                        </TooltipText>
                      </th>
                      <th style={{ width: 140 }}>
                        <TooltipText tooltip="Reporting irrelevance to keywords, inappropriate content, labels on top of the images showing the right order or text needed to solve the flip">
                          Reporting
                          <br />
                          bad flip
                        </TooltipText>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {flip &&
                      longAnswers &&
                      longAnswers.map((item) => (
                        <tr>
                          <td>
                            <div className="user-pic">
                              <img
                                src={
                                  'https://robohash.org/' +
                                  item.address.toLowerCase()
                                }
                                alt="pic"
                                width="32"
                              />
                            </div>
                            <div className="text_block text_block--ellipsis">
                              <Link
                                href="/identity/[address]/epoch/[epoch]/validation"
                                as={`/identity/${item.address}/epoch/${epoch}/validation#longAnswers`}
                              >
                                <a>{item.address}</a>
                              </Link>
                            </div>
                          </td>
                          <td>
                            {epoch && (
                              <IdentityStatus
                                epoch={epoch}
                                address={item.address}
                              ></IdentityStatus>
                            )}
                          </td>
                          <td>
                            {item.flipAnswer !== 'None' ? (
                              item.respAnswer === item.flipAnswer ? (
                                <i class="icon icon--micro_success"></i>
                              ) : (
                                <i class="icon icon--micro_fail"></i>
                              )
                            ) : (
                              ''
                            )}
                            {item.respAnswer === 'None'
                              ? 'No answer'
                              : item.respAnswer}
                          </td>
                          <td>
                            {item.respAnswer === 'None'
                              ? '-'
                              : item.respWrongWords
                              ? 'Reported'
                              : '-'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section_info">
        <div className="row">
          <div className="col-12">
            <h3>Challenged identities</h3>
            <div class="card">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Identity</th>
                      <th style={{ width: 190 }}>
                        <TooltipText tooltip="Identity status before the validation">
                          Status
                        </TooltipText>
                      </th>
                      <th style={{ width: 140 }}>
                        <TooltipText tooltip="Answer given on qualification session">
                          Answer
                        </TooltipText>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {flip &&
                      shortAnswers &&
                      shortAnswers.map((item) => (
                        <tr>
                          <td>
                            <div className="user-pic">
                              <img
                                src={
                                  'https://robohash.org/' +
                                  item.address.toLowerCase()
                                }
                                alt="pic"
                                width="32"
                              />
                            </div>
                            <div className="text_block text_block--ellipsis">
                              <Link
                                href="/identity/[address]/epoch/[epoch]/validation"
                                as={`/identity/${item.address}/epoch/${epoch}/validation#shortAnswers`}
                              >
                                <a>{item.address}</a>
                              </Link>
                            </div>
                          </td>
                          <td>
                            {epoch && (
                              <IdentityStatus
                                epoch={epoch}
                                address={item.address}
                              ></IdentityStatus>
                            )}
                          </td>
                          <td>
                            {item.flipAnswer !== 'None' ? (
                              item.respAnswer === item.flipAnswer ? (
                                <i class="icon icon--micro_success"></i>
                              ) : (
                                <i class="icon icon--micro_fail"></i>
                              )
                            ) : (
                              ''
                            )}
                            {item.respAnswer === 'None'
                              ? 'No answer'
                              : item.respAnswer}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function getImagesPositions(flipContent) {
  const res = {};
  if (!flipContent) {
    return res;
  }
  for (var i = 0; i < flipContent.Pics.length; i++) {
    var buffArray = new Uint8Array(
      flipContent.Pics[i]
        .substring(2)
        .match(/.{1,2}/g)
        .map((byte) => parseInt(byte, 16))
    );
    var lposition = -1,
      rposition = -1;

    if (flipContent.LeftOrder == null) {
      lposition = i == 0 ? 0 : -1;
      rposition = i == 1 ? 0 : -1;
    } else {
      for (var j = 0; j < flipContent.Pics.length; j++) {
        if (flipContent.LeftOrder[j] == i) lposition = j;
        if (flipContent.RightOrder[j] == i) rposition = j;
      }
    }

    var src = URL.createObjectURL(
      new Blob([buffArray], { type: 'image/jpeg' })
    );

    if (lposition >= 0) {
      res['L' + lposition] = src;
    }
    if (rposition >= 0) {
      res['R' + rposition] = src;
    }
  }
  return res;
}

function IdentityStatus({ epoch, address }) {
  const { data } = useQuery(
    ['identityByEpoch', epoch, address],
    (_, epoch, address) => getIdentityByEpoch(address, epoch)
  );

  return <span>{data ? identityStatusFmt(data.prevState) : '-'}</span>;
}

Flip.getInitialProps = function ({ query }) {
  return { cid: query.cid };
};

export default Flip;
