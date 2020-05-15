/* eslint-disable react/jsx-props-no-spreading */
export default function Skeleton({height, ...props}) {
  return (
    <div {...props}>
      <style jsx>{`
        @-webkit-keyframes animation-skeleton {
          from {
            border-color: #edf2f7;
            background: #edf2f7;
          }
          to {
            border-color: #a0aec0;
            background: #a0aec0;
          }
        }
        @keyframes animation-skeleton {
          from {
            border-color: #edf2f7;
            background: #edf2f7;
          }
          to {
            border-color: #a0aec0;
            background: #a0aec0;
          }
        }
        div {
          height: ${height}px;
          border-radius: 2px;
          margin-top: 5px;
          margin-bottom: 5px;
          border-color: #edf2f7 !important;
          box-shadow: none !important;
          opacity: 0.7;
          background: #edf2f7;
          background-clip: padding-box !important;
          cursor: default;
          color: transparent !important;
          -webkit-animation: 0.8s linear infinite alternate animation-skeleton;
          animation: 0.8s linear infinite alternate animation-skeleton;
          pointer-events: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  )
}

export function SkeletonRows({rows = 15, cols}) {
  return (
    <>
      {[...Array(rows).keys()].map((i) => (
        <tr key={i}>
          <td colSpan={cols}>
            <Skeleton height={25} style={{marginTop: 0, marginBottom: 0}} />
          </td>
        </tr>
      ))}
    </>
  )
}
