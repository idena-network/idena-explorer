import {useEffect, useState} from 'react'
import Link from 'next/dist/client/link'
import {useQuery} from 'react-query'
import {filesize} from 'filesize'
import {
  getContract,
  getVerifiedCodeFileLink,
  verifyContract,
} from '../../../shared/api'
import {ContractVerificationState} from '../../../shared/utils/types'

const State = {
  ChooseFile: 0,
  ChoosingFile: 1,
  Underway: 2,
  Failure: 3,
  Success: 4,
}

export default function SourceCode({
  address,
  verification,
  setVerification,
  visible,
}) {
  const [state, setState] = useState(State.ChooseFile)
  const [errorMessage, setErrorMessage] = useState('')
  const [file, setFile] = useState(null)
  const [underwayTimestamp, setUnderwayTimestamp] = useState(null)

  const setErrorState = (msg) => {
    setErrorMessage(msg)
    setState(State.Failure)
  }

  useEffect(() => {
    const verificationState =
      (verification && verification.state) ||
      ContractVerificationState.NotVerified
    if (verificationState === ContractVerificationState.Pending) {
      setState(State.Underway)
    }
    if (verificationState === ContractVerificationState.Verified) {
      setState(State.Success)
    }
    if (verificationState === ContractVerificationState.Failed) {
      setErrorState(verification.errorMessage)
    }
    if (verification && !file) {
      setFile({
        name: verification.fileName,
        size: verification.fileSize,
      })
    }
  }, [verification, file])

  const {data: contractInfo} = useQuery(
    state === State.Underway && ['contract', address],
    (_, epoch) => getContract(epoch),
    {
      refetchInterval: 10 * 1000,
    }
  )

  useEffect(() => {
    if (contractInfo) {
      const verificationState =
        (contractInfo.verification && contractInfo.verification.state) ||
        ContractVerificationState.NotVerified
      if (
        (verificationState === ContractVerificationState.Failed ||
          verificationState === ContractVerificationState.Success) &&
        (!underwayTimestamp ||
          new Date(underwayTimestamp).getTime() <
            new Date(contractInfo.verification.timestamp).getTime())
      ) {
        setVerification(contractInfo.verification)
      }
    }
  }, [contractInfo, setVerification, underwayTimestamp])

  const tryToSubmit = async (file) => {
    if (!file) {
      setErrorState('File is absent. Please Try again.')
      return
    }

    const allowedExtensions = /(\.zip)$/i

    if (!allowedExtensions.exec(file.name)) {
      setErrorState('Wrong file format. Please Try again.')
      return
    }

    const errorMessage = await verifyContract(address, file)
    if (!errorMessage) {
      setUnderwayTimestamp((verification && verification.timestamp) || null)
      setVerification({
        state: ContractVerificationState.Pending,
        fileName: file.name,
        fileSize: file.size,
      })
    } else {
      setErrorState(errorMessage)
    }
  }

  const handleFileChange = async (e) => {
    if (e.target.files) {
      const file = e.target.files[0]
      e.target.value = null
      setFile(file)
      await tryToSubmit(file)
    }
  }

  return (
    <div className="verification-card-content">
      <div
        className={`verification-card-body ${
          state !== State.Success ? 'dashed' : ''
        } ${state === State.ChoosingFile ? 'active' : ''}`}
      >
        {state === State.Success ? (
          <Link href={`${getVerifiedCodeFileLink(address)}`}>
            <a className="btn btn-secondary">
              <i className="icon icon--download" />
              <span>Download</span>
            </a>
          </Link>
        ) : (
          <>
            <input
              type="file"
              onDragEnter={() => {
                if (state === State.Underway) {
                  return
                }
                setState(State.ChoosingFile)
              }}
              onDragLeave={() => {
                if (state === State.Underway) {
                  return
                }
                setState(State.ChooseFile)
              }}
              onDrop={() => {
                if (state === State.Underway) {
                  return
                }
                setState(State.ChooseFile)
              }}
              onChange={handleFileChange}
              disabled={state === State.Underway}
            />

            <div
              className={`verification-card-image ${
                state === State.ChoosingFile ? 'active' : ''
              }`}
            >
              {state === State.ChooseFile && (
                <i className="icon icon--upload" />
              )}
              {state === State.ChoosingFile && (
                <i className="icon icon--upload-active" />
              )}
              {state === State.Underway && (
                <i className="icon icon--underway" />
              )}
              {state === State.Failure && <i className="icon icon--error" />}
            </div>
          </>
        )}

        <div className="verification-card-text">
          <span className="verification-card-text-main">
            {state === State.Success && <>{verification.fileName}</>}
            {(state === State.ChooseFile || state === State.ChoosingFile) && (
              <>
                Drag and Drop zip file with your smart contract project source
                files or{' '}
                <span style={{textDecoration: 'underline'}}>Choose file</span>
              </>
            )}
            {state === State.Underway && <>Verification is underway...</>}
            {state === State.Failure && <>Failed to verify</>}
          </span>
          <br />
          <span className="verification-card-text-comment">
            {state === State.Success && (
              <>{humanizeSize(verification.fileSize)}</>
            )}
            {state === State.Underway && (
              <>It will take some time. You can close this page for now.</>
            )}
            {state === State.Failure && errorMessage}
          </span>
        </div>
      </div>
      {state !== State.Success && (
        <div className="verification-card-footer">
          <span className={`${state === State.Failure ? 'failed' : ''}`}>
            {(state === State.ChooseFile || state === State.ChoosingFile) && (
              <>Supported format: ZIP</>
            )}
            {state === State.Underway && (
              <>
                {(file && file.name) || ''}
                <img className="icon icon--clock" alt="pic" />
              </>
            )}
            {state === State.Failure && (
              <>
                {(file && file.name) || ''}
                <img className="icon icon--warning" alt="pic" />
              </>
            )}
          </span>
          <span>
            {(state === State.ChooseFile || state === State.ChoosingFile) && (
              <>Maximum size: {humanizeSize(524288)}</>
            )}
            {(state === State.Underway || state === State.Failure) && (
              <>{humanizeSize((file && file.size) || 0)}</>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

function humanizeSize(size) {
  return filesize(size, {base: 2, standard: 'jedec'})
}
