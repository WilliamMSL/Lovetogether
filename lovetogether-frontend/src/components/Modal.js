import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import { ReactComponent as PlusIcon } from '../images/assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from '../images/assets/icons/minus.svg';

// Définir l'URL de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:1812';
console.log('API Base URL:', API_BASE_URL);

// Styled components pour les éléments de l'interface utilisateur
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
  background: #fff;
  border-radius: 20px;
  padding: 48px;
  width: 80%;
  max-width: 800px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: black;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  width: fit-content;

  &:hover {
    background-color: #fff5f5;
    color: #ff4500;
    border-color: #ff4500;
    box-shadow: 0 6px 12px rgba(255, 69, 0, 0.3);
  }
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 40px;
  right: 40px;
  background: none;
  border: none;
  font-size: 40px;
  cursor: pointer;
  color: #000;
`;

const SectionTitle = styled.h2`
  font-size: 46px;
  font-weight: bold;
  color: #000;
  margin-bottom: 32px;
  margin-right: 64px;
  line-height: 50px;
`;

const SubTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 0px;
  row-gap: 10px;
  align-items: center;
`;

const Chip = styled.button`
  background: ${props => props.isSelected ? '#ff4500' : '#f0f0f0'};
  color: ${props => props.isSelected ? '#fff' : '#000'};
  border: 2px solid ${props => props.isSelected ? '#ff4500' : '#ddd'};
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: #ff4500;
    color: #fff;
  }
`;

const CategoryChip = styled(Chip)`
  background: ${props => props.isSelected ? '#000' : '#000'};
  color: ${props => props.isSelected ? '#fff' : '#fff'};
  margin-right: 10px;
  border: double;
`;

const ToyChip = styled(Chip)`
  background: ${props => props.isSelected ? '#ff4500' : '#f0f0f0'};
  color: ${props => props.isSelected ? '#fff' : '#000'};
  display: flex;
  align-items: center;
  margin-right: 10px;
  gap: 8px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SmallColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const InputField = styled.input`
  padding: 10px;
  margin-bottom: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Modal = ({ isOpen, onClose, onSave }) => {
  const { firstName1, firstName2, selectedToys, updateUserPreferences } = useContext(UserContext);

  const [toysByCategory, setToysByCategory] = useState({});
  const [tempFormState, setTempFormState] = useState(() => ({
    firstName1: localStorage.getItem('firstName1') || firstName1 || '',
    firstName2: localStorage.getItem('firstName2') || firstName2 || '',
    selectedToys: JSON.parse(localStorage.getItem('selectedToys')) || selectedToys || [],
    selectedCategories: JSON.parse(localStorage.getItem('selectedCategories')) || [],
    toysByCategoryState: JSON.parse(localStorage.getItem('toysByCategoryState')) || {},
  }));

  useEffect(() => {
    setTempFormState(prev => ({
      ...prev,
      firstName1: localStorage.getItem('firstName1') || firstName1 || prev.firstName1,
      firstName2: localStorage.getItem('firstName2') || firstName2 || prev.firstName2,
      selectedToys: JSON.parse(localStorage.getItem('selectedToys')) || selectedToys || prev.selectedToys,
    }));
  }, [firstName1, firstName2, selectedToys]);

  useEffect(() => {
    const fetchToys = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/toys`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const toys = await response.json();
        console.log('Fetched toys:', toys);

        const groupedToys = toys.reduce((acc, toy) => {
          const category = toy.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(toy);
          return acc;
        }, {});

        setToysByCategory(groupedToys);

        setTempFormState(prev => {
          const updatedState = {
            ...prev,
            selectedCategories: Object.keys(groupedToys),
            toysByCategoryState: Object.keys(groupedToys).reduce((acc, category) => {
              acc[category] = prev.toysByCategoryState[category] || [];
              return acc;
            }, {}),
          };
          console.log('Updated tempFormState:', updatedState);
          return updatedState;
        });

      } catch (error) {
        console.error('Error fetching toys:', error);
      }
    };

    fetchToys();
  }, []);

  const handleChange = (e) => {
    setTempFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleCategorySelection = (category) => {
    setTempFormState((prev) => {
      const isSelected = prev.selectedCategories.includes(category);
      const updatedCategories = isSelected
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category];

      const updatedToysByCategoryState = {
        ...prev.toysByCategoryState,
        [category]: isSelected ? [] : (prev.toysByCategoryState[category] || []),
      };

      const updatedSelectedToys = isSelected
        ? prev.selectedToys.filter(toyId => !toysByCategory[category].some(toy => toy.name_id === toyId))
        : [...new Set([...prev.selectedToys, ...updatedToysByCategoryState[category]])];

      return {
        ...prev,
        selectedCategories: updatedCategories,
        toysByCategoryState: updatedToysByCategoryState,
        selectedToys: updatedSelectedToys,
      };
    });
  };

  const toggleToySelection = (toyNameId) => {
    const toyCategory = Object.keys(toysByCategory).find(category =>
      toysByCategory[category].some(t => t.name_id === toyNameId)
    );

    if (!tempFormState.selectedCategories.includes(toyCategory)) {
      return;
    }

    setTempFormState((prev) => {
      const updatedSelectedToys = prev.selectedToys.includes(toyNameId)
        ? prev.selectedToys.filter(t => t !== toyNameId)
        : [...prev.selectedToys, toyNameId];

      const updatedToysByCategoryState = {
        ...prev.toysByCategoryState,
        [toyCategory]: prev.toysByCategoryState[toyCategory].includes(toyNameId)
          ? prev.toysByCategoryState[toyCategory].filter(t => t !== toyNameId)
          : [...prev.toysByCategoryState[toyCategory], toyNameId],
      };

      return {
        ...prev,
        selectedToys: updatedSelectedToys,
        toysByCategoryState: updatedToysByCategoryState,
      };
    });
  };

  const handleSave = () => {
    updateUserPreferences(tempFormState);
    localStorage.setItem('firstName1', tempFormState.firstName1);
    localStorage.setItem('firstName2', tempFormState.firstName2);
    localStorage.setItem('selectedToys', JSON.stringify(tempFormState.selectedToys));
    localStorage.setItem('selectedCategories', JSON.stringify(tempFormState.selectedCategories));
    localStorage.setItem('toysByCategoryState', JSON.stringify(tempFormState.toysByCategoryState));
    
    onSave(tempFormState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <SectionTitle>Personnaliser votre expérience</SectionTitle>
        <ColumnContainer>
          <SmallColumnContainer>
            <SubTitle>À qui avons nous l'honneur ?</SubTitle>
            <InputField
              type="text"
              name="firstName1"
              placeholder="Femme"
              value={tempFormState.firstName1}
              onChange={handleChange}
            />
            <InputField
              type="text"
              name="firstName2"
              placeholder="Homme"
              value={tempFormState.firstName2}
              onChange={handleChange}
            />
          </SmallColumnContainer>
          <SmallColumnContainer>
            <SubTitle>Qu'est ce qu'il y a au menu ?</SubTitle>
            <ChipsContainer>
              {Object.keys(toysByCategory).map((category, index) => (
                <React.Fragment key={index}>
                  <CategoryChip
                    isSelected={tempFormState.selectedCategories.includes(category)}
                    onClick={() => toggleCategorySelection(category)}
                  >
                    {category}
                  </CategoryChip>

                  {tempFormState.selectedCategories.includes(category) &&
                    toysByCategory[category].map((toy, toyIndex) => (
                      <ToyChip
                        key={`toy-${index}-${toyIndex}`}
                        isSelected={tempFormState.selectedToys.includes(toy.name_id)}
                        onClick={() => toggleToySelection(toy.name_id)}
                      >
                        {toy.name}
                        {tempFormState.selectedToys.includes(toy.name_id) ? (
                          <MinusIcon style={{ width: '16px', height: '16px' }} />
                        ) : (
                          <PlusIcon style={{ width: '16px', height: '16px' }} />
                        )}
                      </ToyChip>
                    ))}
                </React.Fragment>
              ))}
            </ChipsContainer>
          </SmallColumnContainer>
        </ColumnContainer>

        <ButtonContainer>
          <Button onClick={handleSave}>
            Confirmer 
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
