/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Container,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from 'reactstrap'
import {useState} from 'react'
import Router, {useRouter} from 'next/router'
import ReactGA from 'react-ga'
import Link from 'next/link'
import {Helmet} from 'react-helmet'
import {search} from '../api'
import {useSession} from '../utils/session-context'
import TopHeader from './topheader'

function Layout({children, title = '', signinLoading = false}) {
  const router = useRouter()
  ReactGA.initialize('UA-139651161-2')
  ReactGA.pageview(router.asPath)

  const {session, logout} = useSession()
  const [state, setState] = useState({
    value: '',
    disabled: false,
    signinLoading,
  })

  const doSearch = async (e) => {
    e.preventDefault()
    setState({...state, disabled: true})
    try {
      const result = await search(state.value)
      if (!result || !result.length) {
        alert('Nothing found...')
      } else {
        for (let i = 0; i < result.length; i += 1) {
          const item = result[i]
          switch (item.name) {
            case 'Address': {
              Router.push(`/address/${item.value}`)
              return
            }
            case 'Block': {
              Router.push(`/block/${item.value}`)
              return
            }
            case 'Flip': {
              Router.push(`/flip/${item.value}`)
              return
            }
            case 'Transaction': {
              Router.push(`/transaction/${item.value}`)
              return
            }
            default:
          }
        }
      }
    } finally {
      setState({...state, disabled: false})
    }
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <TopHeader />
      <header className="header">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-auto">
              <div className="header_logo">
                <a className="" href="/">
                  <img
                    src="/static/images/idena_black.svg"
                    alt="Idena"
                    width="44px"
                  />
                </a>
              </div>
            </div>
            <div className="col">
              <form action="" className="form_search">
                <div className="input-group">
                  <div className="input-addon">
                    <button
                      type="submit"
                      className="btn btn-icon"
                      onClick={doSearch}
                    >
                      <i className="icon icon--search" />
                    </button>
                  </div>
                  <input
                    value={state.value}
                    type="search"
                    placeholder="Address, flip, invitation, transaction, block..."
                    className="form-control"
                    onChange={(e) =>
                      setState({...state, value: e.target.value})
                    }
                    disabled={state.disabled}
                  />
                </div>
              </form>
            </div>

            <div className="col-auto">
              {session.ready &&
                (session.auth ? (
                  <UncontrolledButtonDropdown direction="down">
                    <DropdownToggle tag="a">
                      <div className="user-pic">
                        <img
                          className="user-avatar"
                          src={`https://robohash.idena.io/${session.address}`}
                          alt="pic"
                          width="40"
                        />
                      </div>
                    </DropdownToggle>
                    <DropdownMenu
                      right={false}
                      modifiers={{
                        computeStyle: {
                          enabled: true,
                          order: 900,
                          fn: (data) => ({
                            ...data,
                            styles: {
                              ...data.styles,
                            },
                          }),
                        },
                      }}
                    >
                      <li>
                        <Link
                          href="/address/[address]"
                          as={`/address/${session.address}`}
                        >
                          <a className="btn btn-small btn-icon">
                            <span>My address</span>
                          </a>
                        </Link>
                      </li>
                      <li className="brake" />
                      <li>
                        <a
                          className="btn btn-small btn-icon"
                          onClick={() => logout()}
                        >
                          <span>Log out</span>
                        </a>
                      </li>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                ) : (
                  <Link
                    href={`/signin?callback_url=${encodeURIComponent(
                      router.pathname === '/signin'
                        ? router.query.callback_url || '/'
                        : router.asPath
                    )}&attempt=${parseInt(router.query.attempt || 0) + 1}`}
                  >
                    <a className="btn btn-signin">
                      <img
                        alt="signin"
                        className={`icon icon-logo-white-small ${
                          signinLoading ? 'hidden' : ''
                        }`}
                        width="24px"
                      />
                      <div
                        className={`spinner ${signinLoading ? '' : 'hidden'}`}
                      >
                        <div className="small progress">
                          <div />
                        </div>
                      </div>

                      <span>Sign-in with Idena</span>
                    </a>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </header>
      <main className="main">
        <Container>{children}</Container>
      </main>
    </>
  )
}

export default Layout
