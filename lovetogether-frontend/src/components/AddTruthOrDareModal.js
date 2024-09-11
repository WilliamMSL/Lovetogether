import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import lowIntensityImage from '../images/logo-5.svg';
import mediumIntensityImage from '../images/whitelogo-10.svg';
import highIntensityImage from '../images/whitelogo-20.svg';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  width: 90%;
  height: 90vh;
  max-width: 1200px;
  background-color: ${({ intensity }) => 
    intensity === 'Warm-Up' ? '#FBF8F1' : 
    intensity === 'Foreplay' ? '#D51C2C' : 
    '#5A0C13'};
  background-image: ${({ intensity }) => 
    intensity === 'Warm-Up' ? `url(${lowIntensityImage})` : 
    intensity === 'Foreplay' ? `url(${mediumIntensityImage})` : 
    `url(${highIntensityImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 20px;
  overflow: hidden;
  transition: background-color 0.3s ease, background-image 0.3s ease;
`;

const FormSection = styled.div`
  flex: 1;
  padding: 48px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-grow: 1;
`;

const ChipsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Chip = styled.button`
  background: white;
  border: 2px solid ${props => props.selected ? 'black' : '#E2E2E2'};
  color: black;
  border-radius: 8px;
  padding: 15px 25px;
  cursor: pointer;
  font-size: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: border-color 0.3s ease;
  flex: 1;

  &:hover {
    border-color: black;
  }
`;

const ChipTitle = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
`;

const ChipDescription = styled.span`
  font-size: 14px;
  color: #666;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  background: white;
  color: black;
  border: 2px solid ${props => props.primary ? 'black' : '#E2E2E2'};
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 650;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: black;
  }
`;

const ConfirmButton = styled(Button)`
  background: black;
  color: white;
  margin-top: auto;
`;

const Card = styled.div`
  width: 392px;
  height: 548px;
  background-color: #FBF8F1;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const CardContent = styled.p`
  font-family: Paragon, serif;
  font-size: 24px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  white-space: pre-wrap;
`;

const CardFooter = styled.div`
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 400;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 8px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const AddTruthOrDareModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'dare',
    player: 'all',
    template: '',
    intensity: 'Warm-Up',
    toys: [],
  });
  const [firstName1, setFirstName1] = useState('');
  const [firstName2, setFirstName2] = useState('');
  const [availableToys, setAvailableToys] = useState([]);
  const [showToySelect, setShowToySelect] = useState(false);

  useEffect(() => {
    const storedFirstName1 = localStorage.getItem('firstName1') || '';
    const storedFirstName2 = localStorage.getItem('firstName2') || '';
    setFirstName1(storedFirstName1);
    setFirstName2(storedFirstName2);

    // Fetch available toys
    const fetchToys = async () => {
      try {
        const response = await axios.get('http://localhost:1812/api/toys');
        setAvailableToys(response.data);
      } catch (error) {
        console.error('Error fetching toys:', error);
      }
    };
    fetchToys();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  const handlePlayerChange = (player) => {
    setFormData({ ...formData, player });
  };

  const handleIntensityChange = (intensity) => {
    setFormData({ ...formData, intensity });
  };

  const handleToyChange = (e) => {
    const toyId = e.target.value;
    const isChecked = e.target.checked;
    setFormData(prevState => ({
      ...prevState,
      toys: isChecked
        ? [...prevState.toys, toyId]
        : prevState.toys.filter(id => id !== toyId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1812/api/truthordare', formData);
      alert('Truth or Dare added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding Truth or Dare:', error);
      alert('Failed to add Truth or Dare. Please try again.');
    }
  };

  const getDisplayName = () => {
    if (formData.player === 'firstName2') {
      return firstName2;
    }
    return firstName1;
  };

  const getOtherPlayerName = () => {
    if (formData.player === 'firstName2') {
      return firstName1;
    }
    return firstName2;
  };

  const replacePlayerNames = (text) => {
    return text.replace(/{AutrePlayer}/g, getOtherPlayerName());
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent intensity={formData.intensity}>
        <FormSection>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Title>Ajouter un dare</Title>
          <Form onSubmit={handleSubmit}>
            <ChipsContainer>
              <Chip
                type="button"
                selected={formData.type === 'truth'}
                onClick={() => handleTypeChange('truth')}
              >
                <ChipTitle>Truth 👀</ChipTitle>
                <ChipDescription>Pour les couples débutants</ChipDescription>
              </Chip>
              <Chip
                type="button"
                selected={formData.type === 'dare'}
                onClick={() => handleTypeChange('dare')}
              >
                <ChipTitle>Dare 🔥</ChipTitle>
                <ChipDescription>Pour les couples débutants</ChipDescription>
              </Chip>
            </ChipsContainer>
            <Group>
              <Label>Gage</Label>
              <TextArea
                name="template"
                value={formData.template}
                onChange={handleChange}
                placeholder="vous allez devoir vous occuper de {AutrePlayer} en lui faisant un cuni."
                required
              />
            </Group>
            {formData.type === 'dare' && (
              <>
                <Group>
                  <Label>Qui peut participer au gage ?</Label>
                  <ButtonGroup>
                    <Button type="button" primary={formData.player === 'all'} onClick={() => handlePlayerChange('all')}>Les deux</Button>
                    <Button type="button" primary={formData.player === 'firstName2'} onClick={() => handlePlayerChange('firstName2')}>Homme</Button>
                    <Button type="button" primary={formData.player === 'firstName1'} onClick={() => handlePlayerChange('firstName1')}>Femme</Button>
                  </ButtonGroup>
                </Group>
                <Group>
                  <Label>Intensité ?</Label>
                  <ButtonGroup>
                    <Button type="button" primary={formData.intensity === 'Warm-Up'} onClick={() => handleIntensityChange('Warm-Up')}>Warm-Up</Button>
                    <Button type="button" primary={formData.intensity === 'Foreplay'} onClick={() => handleIntensityChange('Foreplay')}>Foreplay</Button>
                    <Button type="button" primary={formData.intensity === 'MainEvent'} onClick={() => handleIntensityChange('MainEvent')}>Main Event</Button>
                  </ButtonGroup>
                </Group>
                <Group>
                  <Label>Toys</Label>
                  <Select onChange={() => setShowToySelect(!showToySelect)}>
                    <option value="">Sélectionner des toys</option>
                  </Select>
                  {showToySelect && (
                    <CheckboxContainer>
                      {availableToys.map(toy => (
                        <CheckboxLabel key={toy._id}>
                          <input
                            type="checkbox"
                            value={toy._id}
                            checked={formData.toys.includes(toy._id)}
                            onChange={handleToyChange}
                          />
                          {toy.name}
                        </CheckboxLabel>
                      ))}
                    </CheckboxContainer>
                  )}
                </Group>
              </>
            )}
            <ConfirmButton type="submit">Confirmer</ConfirmButton>
          </Form>
        </FormSection>
        <CardSection>
          <Card>
            <CardTitle>TRUTH OR DARE</CardTitle>
            <CardContent>
              {`${getDisplayName()}, ${replacePlayerNames(formData.template)}`}
            </CardContent>
            <CardFooter>LOVETOGETHER</CardFooter>
          </Card>
        </CardSection>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddTruthOrDareModal;