import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Panel,
  PanelHeader,
  Div,
  Gallery,
  Avatar,
  Button
} from '@vkontakte/vkui';

const designs = [
  { src: '/design1.jpg' },
  { src: '/design2.jpg' },
  { src: '/design3.jpg' },
  { src: '/design4.jpg' },
  { src: '/design5.jpg' }
];

const SendValentineDesignSelect = ({ onNext }) => {

  const [selectedDesign, setSelectedDesign] = useState(null);

  return (
    <Panel>
      <PanelHeader>Выберите дизайн</PanelHeader>

      <Div>
        <Div style={{ justifyContent: 'center' }}>
          <Div style={{
            width: 300,
            height: 400,
            border: '1px solid gray'
          }}>
            {selectedDesign && (
              <img src={selectedDesign.src} />
            )}
          </Div>
        </Div>
      </Div>

      <Gallery style={{ height: 120 }}>
        {designs.map(d => (
          <Avatar
            key={d.src}
            src={d.src}
            onClick={() => setSelectedDesign(d)}
          />
        ))}
      </Gallery>

      <Div>
        <Button size="l" stretched onClick={() => onNext()}>
          Далее
        </Button>
      </Div>

    </Panel>
  );
}
SendValentineDesignSelect.propTypes = {
  id: PropTypes.string,
  onSelectDesign: PropTypes.func,
  onNext: PropTypes.func,
};
export default SendValentineDesignSelect;