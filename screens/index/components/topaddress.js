/* eslint-disable react/prop-types */
import Link from 'next/link'
import {useInfiniteQuery} from 'react-query'
import React, {useState} from 'react'
import {styled} from '@stitches/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import {blackA} from '@radix-ui/colors'
import {CheckIcon, DotsVerticalIcon} from '@radix-ui/react-icons'
import {SkeletonRows} from '../../../shared/components/skeleton'
import {getBalances} from '../../../shared/api'
import {precise2, dnaFmt} from '../../../shared/utils/utils'

const LIMIT = 30

export default function TopAddress({visible}) {
  const [sortBy, setSortBy] = useState('balance')

  const fetchBalances = (_, continuationToken = null) =>
    getBalances(sortBy, LIMIT, continuationToken)

  const {data, fetchMore, canFetchMore, status} = useInfiniteQuery(
    visible && 'topaddress' && sortBy,
    fetchBalances,
    {
      getFetchMore: (lastGroup) =>
        lastGroup && lastGroup.continuationToken
          ? lastGroup.continuationToken
          : false,
    }
  )

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th style={{width: '55%'}}>Address</th>
            <th style={{width: '20%'}}>Balance</th>
            <th style={{width: '20%'}}>Stake</th>
            <th style={{width: '5%'}}>
              <SortByMenu value={sortBy} onChangeValue={setSortBy} />
            </th>
          </tr>
        </thead>
        <tbody>
          {!visible || (status === 'loading' && <SkeletonRows cols={4} />)}
          {data.map(
            (page) =>
              page &&
              page.map((item) => (
                <tr key={item.address}>
                  <td>
                    <div className="user-pic">
                      <img
                        src={`https://robohash.idena.io/${item.address.toLowerCase()}`}
                        alt="pic"
                        width="32"
                      />
                    </div>
                    <div className="text_block text_block--ellipsis">
                      <Link
                        href="/address/[address]"
                        as={`/address/${item.address}`}
                      >
                        <a>{item.address}</a>
                      </Link>
                    </div>
                  </td>
                  <td>{dnaFmt(precise2(item.balance), '')}</td>
                  <td>{dnaFmt(precise2(item.stake), '')}</td>
                  <td />
                </tr>
              ))
          )}
        </tbody>
      </table>
      <div
        className="text-center"
        style={{display: canFetchMore ? 'block' : 'none'}}
      >
        <button
          type="button"
          className="btn btn-small"
          onClick={() => fetchMore()}
        >
          Show more
        </button>
      </div>
    </div>
  )
}

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  minWidth: 160,
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
  },
})

const itemStyles = {
  all: 'unset',
  fontSize: '0.875rem',
  color: blackA.blackA12,
  lineHeight: 1,
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  position: 'relative',
  padding: '8px 0 8px 13px',
  userSelect: 'none',
  cursor: 'pointer',

  '&:focus': {
    backgroundColor: blackA.blackA3,
  },
}

const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, {
  '&[data-state="checked"]': {
    color: '#578fff',
  },
  ...itemStyles,
})

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
  padding: '8px 0 5px 13px',
  fontSize: '0.875rem',
  lineHeight: '25px',
})

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: blackA.blackA3,
})

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 130,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#578fff',
})

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = StyledContent
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
export const DropdownMenuRadioItem = StyledRadioItem
export const DropdownMenuItemIndicator = StyledItemIndicator
export const DropdownMenuLabel = StyledLabel
export const DropdownMenuSeparator = StyledSeparator

const Box = styled('div', {})

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '15%',
  height: 25,
  width: 19,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {backgroundColor: blackA.blackA3},
  '&:focus': {boxShadow: `none`, outline: 'none'},
})

const SortByMenu = ({value, onChangeValue}) => (
  <Box>
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <IconButton>
          <DotsVerticalIcon />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5} align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChangeValue}>
          <DropdownMenuRadioItem value="balance">
            Balance
            <DropdownMenuItemIndicator>
              <CheckIcon />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="stake">
            Stake
            <DropdownMenuItemIndicator>
              <CheckIcon />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Box>
)
