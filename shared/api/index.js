import axios from 'axios'

const BASE_API_URL = 'https://api.idena.org/api'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

function apiCoingecko() {
  return axios.create({
    baseURL: COINGECKO_API_URL,
  })
}

function apiClient() {
  return axios.create({
    baseURL: BASE_API_URL,
  })
}

async function getResponse(request) {
  const {data} = await request
  const {result, continuationToken, error} = data
  if (error) throw error
  if (continuationToken) result.continuationToken = continuationToken
  return result
}

export async function getCoingeckoData() {
  const params = {
    ids: 'idena',
    vs_currencies: 'usd',
    include_market_cap: true,
    include_24hr_vol: true,
    include_24hr_change: true,
    include_last_updated_at: true,
  }

  const request = apiCoingecko().get('/simple/price', {params})
  const {data} = await request
  return data
}

export async function getCurrentSession(onlyCheck) {
  return axios
    .get('/api/auth/session', {params: {onlyCheck}})
    .then((x) => x.data)
}

export async function logout() {
  return axios.post('/api/auth/logout').then((x) => x.data)
}

export async function getAuthToken() {
  return axios.get('/api/auth/new-token').then((x) => x.data)
}

export async function search(value) {
  return getResponse(apiClient().get('search', {params: {value}}))
}

export async function getAddressInfo(address) {
  return getResponse(apiClient().get(`address/${address}`))
}

export async function getTransaction(hash) {
  return getResponse(apiClient().get(`transaction/${hash}`))
}

export async function getBlock(block) {
  return getResponse(apiClient().get(`block/${block}`))
}

export async function getBlockTransactions(block, limit, continuationToken) {
  return getResponse(
    apiClient().get(`block/${block}/txs`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getTransactions(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`address/${address}/txs`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getTransactionsCount(address) {
  return getResponse(apiClient().get(`address/${address}/txs/count`))
}

export async function getRewards(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`identity/${address}/epochrewards`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getRewardsCount(address) {
  return getResponse(apiClient().get(`identity/${address}/epochrewards/count`))
}

export async function getPenalties(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`address/${address}/penalties`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getPenaltiesCount(address) {
  return getResponse(apiClient().get(`address/${address}/penalties/count`))
}

export async function getTotalCoins() {
  return getResponse(apiClient().get('coins'))
}

export async function getCirculatingSupply() {
  return getResponse(apiClient().get('circulatingsupply?format=short'))
}

export async function getLastEpoch() {
  return getResponse(apiClient().get('epoch/last'))
}

export async function getUpgradeVoting() {
  return getResponse(apiClient().get('UpgradeVoting'))
}

export async function getEpoch(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}`))
}

export async function getEpochIdentitiesCount(
  epoch,
  states = ['Newbie', 'Verified', 'Human'],
  prevStates = []
) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identities/count`, {
      params: {states, prevStates},
    })
  )
}

export async function getEpochIdentities(
  epoch,
  limit,
  continuationToken,
  states = ['Newbie', 'Verified', 'Human'],
  prevStates = []
) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identities`, {
      params: {states, limit, continuationToken, prevStates},
    })
  )
}

export async function getEpochInvitations(epoch, limit, continuationToken) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/invites`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getEpochFlips(epoch, limit, continuationToken) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/flips`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getEpochTransactions(epoch, limit, continuationToken) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/txs`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getEpochBlocks(epoch, limit, continuationToken) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/blocks`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getEpochBlocksCount(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/blocks/count`))
}

export async function getEpochFlipsCount(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/flips/count`))
}

export async function getEpochTransactionsCount(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/txs/count`))
}

export async function getEpochInvitesSummary(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/invitesSummary`))
}

export async function getEpochIdentitiesSummary(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/identityStatesSummary`))
}

export async function getEpochFlipWrongWordsSummary(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/flipWrongWordsSummary`))
}

export async function getEpochFlipStatesSummary(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/flipStatesSummary`))
}

export async function getEpochRewardsSummary(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/rewardsSummary`))
}

export async function getEpochRewardBounds(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/rewardBounds`))
}

export async function getEpochIdentityRewards(epoch, limit, continuationToken) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identityRewards`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getEpochIdentityRewardsCount(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/identityRewards/count`))
}

export async function getEpochBadAuthors(epoch, limit, continuationToken) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/authors/bad`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getEpochBadAuthorsCount(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/authors/bad/count`))
}

export async function getEpochsData(limit, continuationToken) {
  return getResponse(
    apiClient().get('epochs', {params: {limit, continuationToken}})
  )
}

export async function getEpochsDataCount() {
  return getResponse(apiClient().get('epochs/count'))
}

export async function getHardForkVotingHistory(upgrade) {
  return getResponse(apiClient().get(`upgrade/${upgrade}/votinghistory`))
}

export async function getUpgradeVotings(limit) {
  return getResponse(apiClient().get('UpgradeVotings', {params: {limit}}))
}

export async function getUpgradeData(upgrade) {
  return getResponse(apiClient().get(`upgrade/${upgrade}`))
}

export async function getValidatorsCount() {
  return getResponse(apiClient().get('validators/count'))
}

export async function getOnlineValidatorsCount() {
  return getResponse(apiClient().get('onlineValidators/count'))
}

export async function getOnlineMinersCount() {
  return getResponse(apiClient().get('onlineminers/count'))
}

export async function getOnlineIdentitiesCount() {
  return getResponse(apiClient().get('onlineidentities/count'))
}

export async function getBalances(limit, continuationToken) {
  return getResponse(
    apiClient().get('balances', {params: {limit, continuationToken}})
  )
}

export async function getBalanceChanges(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`address/${address}/balance/changes`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getOnlineIdentities(limit, continuationToken) {
  return getResponse(
    apiClient().get('onlineidentities', {
      params: {limit, continuationToken},
    })
  )
}

export async function getIdentity(address) {
  return getResponse(apiClient().get(`identity/${address}`))
}

export async function getIdentityByEpoch(address, epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/identity/${address}`))
}

export async function getIdentityRewardsByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/rewards`)
  )
}

export async function getIdentityRewardedFlipsByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/rewardedFlips`)
  )
}

export async function getIdentityRewardedInvitesByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/rewardedInvites`)
  )
}

export async function getIdentityAvailableInvitesByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/availableInvites`)
  )
}

export async function getIdentitySavedInviteRewardsByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/savedInviteRewards`)
  )
}

export async function getIdentityReportRewardsByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/reportRewards`)
  )
}

export async function getIdentityShortAnswersByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/answers/short`)
  )
}

export async function getIdentityLongAnswersByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/answers/long`)
  )
}

export async function getIdentityAuthorsBadByEpoch(address, epoch) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identity/${address}/authors/bad`)
  )
}

export async function getEpochsCount(address) {
  return getResponse(apiClient().get(`identity/${address}/epochs/count`))
}

export async function getOnlineStatus(address) {
  return getResponse(apiClient().get(`onlineidentity/${address}`))
}

export async function getIdentityAge(address) {
  return getResponse(apiClient().get(`identity/${address}/age`))
}

export async function getIdentityFlipStates(address) {
  return getResponse(apiClient().get(`identity/${address}/flipStates`))
}

export async function getIdentityEpochs(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`identity/${address}/epochs`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getIdentityEpochsCount(address) {
  return getResponse(apiClient().get(`identity/${address}/epochs/count`))
}

export async function getAddressFlips(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`identity/${address}/flips`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getAddressFlipsCount(address) {
  return getResponse(apiClient().get(`identity/${address}/flips/count`))
}

export async function getIdentityInvites(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`identity/${address}/invites`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getIdentityInvitesCount(address) {
  return getResponse(apiClient().get(`identity/${address}/invites/count`))
}

export async function getFlip(cid) {
  return getResponse(apiClient().get(`flip/${cid}`))
}

export async function getFlipContent(cid) {
  return getResponse(apiClient().get(`flip/${cid}/content`))
}

export async function getAdjacentFlips(cid) {
  return getResponse(apiClient().get(`flip/${cid}/epoch/adjacentFlips`))
}

export async function getFlipShortAnswers(cid) {
  return getResponse(apiClient().get(`flip/${cid}/answers/short`))
}

export async function getFlipLongAnswers(cid) {
  return getResponse(apiClient().get(`flip/${cid}/answers/long`))
}

export async function getContract(address) {
  return getResponse(apiClient().get(`contract/${address}`))
}

export async function getContractBalanceUpdates(
  address,
  limit,
  continuationToken
) {
  return getResponse(
    apiClient().get(`contract/${address}/balanceUpdates`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getTimeLockContract(address) {
  return getResponse(apiClient().get(`timeLockContract/${address}`))
}

export async function getOracleVotingContract(address) {
  return getResponse(apiClient().get(`oracleVotingContract/${address}`))
}

export async function getMempoolTxs(limit) {
  return getResponse(
    apiClient().get(`Mempool/Txs`, {
      params: {limit},
    })
  )
}

export async function getPoolsCount() {
  return getResponse(apiClient().get(`pools/count`))
}

export async function getPools(limit, continuationToken) {
  return getResponse(
    apiClient().get(`pools`, {
      params: {limit, continuationToken},
    })
  )
}

export async function getPool(address) {
  return getResponse(apiClient().get(`pool/${address}`))
}

export async function getPoolDelegators(address, limit, continuationToken) {
  return getResponse(
    apiClient().get(`pool/${address}/delegators`, {
      params: {limit, continuationToken},
    })
  )
}
