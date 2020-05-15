/* eslint-disable react/jsx-props-no-spreading */
import {useState, useRef} from 'react'
import {Tooltip} from 'reactstrap'

export default function TooltipText({
  tooltip,
  children,
  placement = 'bottom',
  ...props
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const ref = useRef(null)
  return (
    <>
      <span ref={ref} {...props}>
        {children}
      </span>
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
