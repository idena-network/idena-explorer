import {query as q} from 'faunadb'
import {serverClient} from '../../../shared/utils/faunaAuth'
import {FAUNA_IDX_NAME} from '../../../shared/utils/constants'
import {checkSignature} from '../../../shared/utils/ether'

export default async (req, res) => {
  const {token, signature} = req.body

  const result = await serverClient.query(
    q.Map(
      q.Paginate(q.Match(q.Index(FAUNA_IDX_NAME), token)),
      q.Lambda((x) => q.Get(x))
    )
  )

  if (!result.data.length) {
    return res.json({
      success: false,
      data: {
        authenticated: false,
      },
    })
  }

  const faunaItem = result.data[0]

  const address = checkSignature(faunaItem.data.nonce, signature)

  if (address.toLowerCase() !== faunaItem.data.address.toLowerCase()) {
    return res.json({
      success: false,
      data: {
        authenticated: false,
      },
    })
  }

  await serverClient.query(
    q.Update(q.Ref(faunaItem.ref), {data: {authenticated: true}})
  )

  return res.json({
    success: true,
    data: {
      authenticated: true,
    },
  })
}
