import axios from 'axios'

const BASE_API_URL = 'https://api.idena.org/api'

function apiClient() {
  return axios.create({
    baseURL: BASE_API_URL,
  })
}

async function getResponse(request) {
  const {data} = await request
  const {result, error} = data
  if (error) throw error
  return result
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

export async function getBlockTransactions(block, skip, limit) {
  return getResponse(
    apiClient().get(`block/${block}/txs`, {
      params: {skip, limit},
    })
  )
}

export async function getTransactions(address, skip, limit) {
  return getResponse(
    apiClient().get(`address/${address}/txs`, {
      params: {skip, limit},
    })
  )
}

export async function getTransactionsCount(address) {
  return getResponse(apiClient().get(`address/${address}/txs/count`))
}

export async function getRewards(address, skip, limit) {
  return getResponse(
    apiClient().get(`identity/${address}/epochrewards`, {
      params: {skip, limit},
    })
  )
}

export async function getRewardsCount(address) {
  return getResponse(apiClient().get(`identity/${address}/epochrewards/count`))
}

export async function getPenalties(address, skip, limit) {
  return getResponse(
    apiClient().get(`address/${address}/penalties`, {
      params: {skip, limit},
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
  skip,
  limit,
  states = ['Newbie', 'Verified', 'Human'],
  prevStates = []
) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identities`, {
      params: {states, skip, limit, prevStates},
    })
  )
}

export async function getEpochInvitations(epoch, skip, limit) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/invites`, {
      params: {skip, limit},
    })
  )
}

export async function getEpochFlips(epoch, skip, limit) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/flips`, {
      params: {skip, limit},
    })
  )
}

export async function getEpochTransactions(epoch, skip, limit) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/txs`, {
      params: {skip, limit},
    })
  )
}

export async function getEpochBlocks(epoch, skip, limit) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/blocks`, {
      params: {skip, limit},
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

export async function getEpochIdentityRewards(epoch, skip, limit) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/identityRewards`, {
      params: {skip, limit},
    })
  )
}

export async function getEpochIdentityRewardsCount(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/identityRewards/count`))
}

export async function getEpochBadAuthors(epoch, skip, limit) {
  return getResponse(
    apiClient().get(`epoch/${epoch}/authors/bad`, {
      params: {skip, limit},
    })
  )
}

export async function getEpochBadAuthorsCount(epoch) {
  return getResponse(apiClient().get(`epoch/${epoch}/authors/bad/count`))
}

export async function getEpochsData(skip, limit) {
  return getResponse(apiClient().get('epochs', {params: {skip, limit}}))
}

export async function getEpochsDataCount() {
  return getResponse(apiClient().get('epochs/count'))
}

export async function getOnlineMinersCount() {
  return getResponse(apiClient().get('onlineminers/count'))
}

export async function getOnlineIdentitiesCount() {
  return getResponse(apiClient().get('onlineidentities/count'))
}

export async function getBalances(skip, limit) {
  return getResponse(apiClient().get('balances', {params: {skip, limit}}))
}

export async function getOnlineIdentities(skip, limit) {
  return getResponse(
    apiClient().get('onlineidentities', {
      params: {skip, limit},
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

export async function getIdentityEpochs(address, skip, limit) {
  return getResponse(
    apiClient().get(`identity/${address}/epochs`, {
      params: {skip, limit},
    })
  )
}

export async function getIdentityEpochsCount(address) {
  return getResponse(apiClient().get(`identity/${address}/epochs/count`))
}

export async function getAddressFlips(address, skip, limit) {
  return getResponse(
    apiClient().get(`address/${address}/flips`, {
      params: {skip, limit},
    })
  )
}

export async function getAddressFlipsCount(address) {
  return getResponse(apiClient().get(`address/${address}/flips/count`))
}

export async function getIdentityInvites(address, skip, limit) {
  return getResponse(
    apiClient().get(`identity/${address}/invites`, {
      params: {skip, limit},
    })
  )
}

export async function getIdentityInvitesCount(address) {
  return getResponse(apiClient().get(`identity/${address}/invites`))
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
  return getResponse(
    apiClient().get(`flip/${cid}/answers/short?skip=0&limit=100`)
  )
}

export async function getFlipLongAnswers(cid) {
  return getResponse(
    apiClient().get(`flip/${cid}/answers/long?skip=0&limit=100`)
  )
}
