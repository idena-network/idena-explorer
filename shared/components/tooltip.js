/* eslint-disable react/jsx-props-no-spreading */
import {useState, useRef, useEffect} from 'react'
import {Tooltip} from 'reactstrap'

export default function TooltipText({
  tooltip,
  children,
  placement = 'bottom',
  ...props
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    setCurrent(ref && ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  return (
    <>
      <span ref={ref} {...props}>
        {children}
      </span>
      {current && tooltip && (
        <Tooltip
          target={current}
          placement={placement}
          arrowClassName="toolTipArrow"
          popperClassName="toolTipPopper"
          innerClassName="toolTipInnerPopper"
          offset="0 8px"
          isOpen={tooltipOpen}
          toggle={() => setTooltipOpen(!tooltipOpen)}
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  )
}

export function IconTooltip({tooltip, placement = 'bottom', ...props}) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const ref = useRef(null)
  return (
    <>
      <i ref={ref} {...props} />
      {ref.current && (
        <Tooltip
          target={ref.current}
          placement={placement}
          isOpen={tooltipOpen}
          toggle={() => setTooltipOpen(!tooltipOpen)}
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  )
}

export function WarningTooltip({tooltip, placement = 'bottom', ...props}) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const ref = useRef(null)
  return (
    <>
      <svg
        width="16"
        height="16"
        fill="red"
        viewBox="0 0 16 16"
        ref={ref}
        {...props}
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
      </svg>
      {ref.current && (
        <Tooltip
          target={ref.current}
          placement={placement}
          isOpen={tooltipOpen}
          toggle={() => setTooltipOpen(!tooltipOpen)}
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  )
}
