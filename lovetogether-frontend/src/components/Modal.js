import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import { ReactComponent as PlusIcon } from '../images/assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from '../images/assets/icons/minus.svg';
import { ReactComponent as ChevronDownIcon } from '../images/assets/icons/chevron-down.svg';
import { ReactComponent as XIcon } from '../images/assets/icons/x-square.svg';
import logger from '../utils/logger';
import { API_BASE_URL } from '../constants/api';
import backgroundCard1 from '../images/backgrounds/background-card-1.png';
import useButtonSound from '../hooks/useButtonSound';

// Définir l'URL de base de l'API
// API Base URL log removed for security

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10000000000000000000000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  max-width: 800px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 768px) {
    padding: 24px;
    max-height: 90vh;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 26px;
  font-weight: 500;
  color: #000;
  margin: 0;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #F3F3F3;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background-color: #E8E8E8;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 22px;
  height: 44px;
  background-color: #F3F3F3;
  border: none;
  border-radius: 1000px;
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    background-color: #E8E8E8;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SubTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 16px;
  font-family: 'Poppins', sans-serif;
`;

const SubTitleMargin = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 16px;
  font-family: 'Poppins', sans-serif;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const Chip = styled.button`
  height: 40px;
  padding: 0 16px;
  background-color: ${props => props.isSelected ? '#C3C3C3' : '#F3F3F3'};
  color: #000;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${props => props.isSelected ? '#B0B0B0' : '#E8E8E8'};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CategoryChip = styled(Chip)`
  background-image: url(${backgroundCard1});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
`;

const ToyChip = styled(Chip)`
  background-color: ${props => props.isSelected ? '#C3C3C3' : '#F3F3F3'};
  color: #000;
  
  svg {
    color: #000;
    stroke: #000;
  }
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

const SmallColumnContainer2 = styled.div`
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

const MobileAccordion = styled.div`
  @media (min-width: 769px) {
    display: none;
  }
`;

const AccordionItem = styled.div`
  margin-bottom: 12px;
`;

const AccordionHeader = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  height: 40px;
  background-color: #F3F3F3;
  border: none;
  border-radius: 14px;
  text-align: left;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background-color: #E8E8E8;
  }
`;

const AccordionContent = styled.div`
  padding: 8px 0;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const MobileListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 0;
`;

const CheckboxWrapper = styled.div`
  position: relative;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid #C2C2C2;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  background-color: ${props => props.checked ? '#C3C3C3' : 'transparent'};
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    border-width: 1.5px;
  }
  
  &:after {
    content: '';
    position: absolute;
    display: ${props => props.checked ? 'block' : 'none'};
    left: 50%;
    top: 50%;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -60%) rotate(45deg);
    
    @media (max-width: 768px) {
      width: 4px;
      height: 8px;
      border-width: 0 1.5px 1.5px 0;
    }
  }
`;

const Checkbox = ({ id, checked, onChange, ...props }) => {
  return (
    <CheckboxWrapper>
      <CheckboxInput
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <CheckboxLabel
        htmlFor={id}
        checked={checked}
        onClick={(e) => {
          e.preventDefault();
          onChange();
        }}
      />
    </CheckboxWrapper>
  );
};

const Label = styled.label`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
`;

const DesktopChipsContainer = styled(ChipsContainer)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const ChevronIcon = styled(ChevronDownIcon)`
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const MobileDeselectAllButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    background: none;
    border: none;
    color: #666;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease;
    width: fit-content;
    text-decoration: underline;
    margin-bottom: 16px;

    &:hover {
      color: #000;
    }
  }
`;

const Modal = ({ isOpen, onClose, onSave }) => {
  const { firstName1, firstName2, selectedToys, updateUserPreferences } = useContext(UserContext);
  const playButtonSound = useButtonSound();

  const [toysByCategory, setToysByCategory] = useState({});
  const [loadingToys, setLoadingToys] = useState(true);
  const [toysError, setToysError] = useState(null);
  const [tempFormState, setTempFormState] = useState(() => ({
    firstName1: localStorage.getItem('firstName1') || firstName1 || '',
    firstName2: localStorage.getItem('firstName2') || firstName2 || '',
    selectedToys: JSON.parse(localStorage.getItem('selectedToys')) || selectedToys || [],
    selectedCategories: JSON.parse(localStorage.getItem('selectedCategories')) || [],
    toysByCategoryState: JSON.parse(localStorage.getItem('toysByCategoryState')) || {},
  }));
  const [openAccordions, setOpenAccordions] = useState({});

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
      setLoadingToys(true);
      setToysError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/toys`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const toys = await response.json();
        logger.log('Fetched toys:', toys);

        if (!Array.isArray(toys) || toys.length === 0) {
          logger.warn('No toys found in API response');
          setToysError('Aucun jouet trouvé dans la base de données');
          setToysByCategory({});
          setLoadingToys(false);
          return;
        }

        const groupedToys = toys.reduce((acc, toy) => {
          const category = toy.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(toy);
          return acc;
        }, {});

        logger.log('Grouped toys by category:', groupedToys);
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
          logger.log('Updated tempFormState:', updatedState);
          return updatedState;
        });

      } catch (error) {
        logger.error('Error fetching toys:', error);
        setToysError(`Erreur lors du chargement des jouets: ${error.message}`);
        setToysByCategory({});
      } finally {
        setLoadingToys(false);
      }
    };

    // Ne fetch que si le modal est ouvert
    if (isOpen) {
      fetchToys();
    }
  }, [isOpen]);

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
    playButtonSound();
    updateUserPreferences(tempFormState);
    localStorage.setItem('firstName1', tempFormState.firstName1);
    localStorage.setItem('firstName2', tempFormState.firstName2);
    localStorage.setItem('selectedToys', JSON.stringify(tempFormState.selectedToys));
    localStorage.setItem('selectedCategories', JSON.stringify(tempFormState.selectedCategories));
    localStorage.setItem('toysByCategoryState', JSON.stringify(tempFormState.toysByCategoryState));
    
    onSave(tempFormState);
    onClose();
  };

  const toggleAccordion = (category) => {
    setOpenAccordions(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const deselectAllToys = () => {
    setTempFormState(prev => ({
      ...prev,
      selectedToys: [],
      toysByCategoryState: Object.keys(prev.toysByCategoryState).reduce((acc, category) => {
        acc[category] = [];
        return acc;
      }, {}),
    }));
  };

  const renderToySelection = (category) => {
    if (window.innerWidth <= 768) {
      return (
        <AccordionContent isOpen={openAccordions[category]}>
          {toysByCategory[category].map((toy, toyIndex) => (
            <MobileListItem key={`toy-${category}-${toyIndex}`}>
              <Checkbox
                id={`toy-${toy.name_id}`}
                checked={tempFormState.selectedToys.includes(toy.name_id)}
                onChange={() => toggleToySelection(toy.name_id)}
              />
              <Label htmlFor={`toy-${toy.name_id}`}>{toy.name}</Label>
            </MobileListItem>
          ))}
        </AccordionContent>
      );
    } else {
      return toysByCategory[category].map((toy, toyIndex) => (
        <ToyChip
          key={`toy-${category}-${toyIndex}`}
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
      ));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TitleContainer>
          <SectionTitle>Personnaliser votre expérience</SectionTitle>
          <CloseButton onClick={onClose}>
            <XIcon />
          </CloseButton>
        </TitleContainer>
        <ColumnContainer>
          <SmallColumnContainer>
           
            <MobileDeselectAllButton onClick={deselectAllToys}>
              Tout désélectionner
            </MobileDeselectAllButton>
            
            {loadingToys && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Chargement des jouets...
              </div>
            )}
            
            {toysError && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#ff4500' }}>
                {toysError}
                <br />
                <small style={{ color: '#666', marginTop: '10px', display: 'block' }}>
                  Vérifiez que le serveur API est démarré sur {API_BASE_URL}
                </small>
              </div>
            )}
            
            {!loadingToys && !toysError && Object.keys(toysByCategory).length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Aucun jouet disponible
              </div>
            )}
            
            <DesktopChipsContainer>
              {Object.keys(toysByCategory).map((category, index) => (
                <React.Fragment key={index}>
                  <CategoryChip
                    isSelected={tempFormState.selectedCategories.includes(category)}
                    onClick={() => toggleCategorySelection(category)}
                  >
                    {category}
                  </CategoryChip>

                  {tempFormState.selectedCategories.includes(category) && renderToySelection(category)}
                </React.Fragment>
              ))}
            </DesktopChipsContainer>
            <MobileAccordion>
              {Object.keys(toysByCategory).map((category, index) => (
                <AccordionItem key={index}>
                  <AccordionHeader onClick={() => toggleAccordion(category)}>
                    {category}
                    <ChevronIcon isOpen={openAccordions[category]} />
                  </AccordionHeader>
                  {renderToySelection(category)}
                </AccordionItem>
              ))}
            </MobileAccordion>
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