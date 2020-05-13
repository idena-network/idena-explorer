import { useEffect, useState } from 'react';
import {
  getOnlineMinersCount,
  getOnlineIdentitiesCount,
} from '../../../shared/api';
import TooltipText from '../../../shared/components/tooltip';

const initialState = {
  online: '-',
  total: '-',
};

export default function Identities() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    async function getData() {
      const [online, total] = await Promise.all([
        getOnlineMinersCount(),
        getOnlineIdentitiesCount(),
      ]);
      setState({
        online,
        total,
      });
    }
    getData();
  }, []);

  return (
    <div className="col-12 col-sm-3">
      <h1>Identities</h1>
      <div className="card">
        <div className="info_block">
          <div className="row">
            <div className="col-12 col-sm-12 bordered-col">
              <h3 className="info_block__accent">
                <span>{state.online}</span> / <span>{state.total}</span>
              </h3>
              <TooltipText
                className="control-label"
                data-toggle="tooltip"
                tooltip="Online miners / Total validated identities"
              >
                Online / Total
              </TooltipText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
