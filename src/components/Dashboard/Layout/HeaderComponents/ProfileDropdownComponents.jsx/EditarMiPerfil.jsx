import React, { useState, useEffect } from 'react';
import Modal from '../../../CommonComponts/Modals';
import Inputs from '../../../CommonComponts/Inputs';
import MainButton from '../../../CommonComponts/MainButton';
import SecondaryButton from '../../../CommonComponts/SecondaryButton';
import { useNotification } from '../../../CommonComponts/ToastNotifications';
import styled from 'styled-components';
import { Typography, Form, Spin, Radio, notification } from 'antd';
import { useTheme } from '../../../../../context/ThemeContext';
import { useAuth } from '../../../../../context/AuthContext';
import { useLanguage } from '../../../../../context/LanguageContext';
import { profileEditTranslations } from '../../../../../utils/Modals/EditarMiPerfil';

const { Title } = Typography;

// Enhanced styled components with better theme awareness
const ModalContent = styled.div`
  padding: 20px 15px;
  background-color: ${({ theme }) => theme.token.contentBg};
  border-radius: 8px;
  
  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const ModalTitle = styled(Title)`
  text-align: center;
  margin-bottom: 25px !important;
  color: ${({ theme }) => theme.token.titleColor} !important;
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 20px !important;
    margin-bottom: 20px !important;
  }
`;

const FormContainer = styled(Form)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FormItem = styled(Form.Item)`
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
  
  label {
    font-weight: 500;
    margin-bottom: 8px;
    display: block;
    color: ${({ theme }) => theme.token.subtitleBlack};
    font-size: 14px;
  }
  
  .ant-form-item-explain-error {
    color: ${({ theme }) => theme.currentTheme === 'themeDark' ? '#ff7875' : '#ff4d4f'};
    font-size: 12px;
    margin-top: 4px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  
  @media (max-width: 480px) {
    margin-top: 24px;
    flex-direction: column-reverse;
    gap: 12px;
    
    button {
      width: 100%;
    }
  }
`;

const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const TestContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-top: 1px dashed ${({ theme }) => theme.token.subtitleBlack};
`;

const EditarMiPerfil = ({ show, onClose }) => {
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();
  const translations = profileEditTranslations[language];
  
  // Test state for notification type
  const [testResult, setTestResult] = useState('success');
  
  // Reset and populate form when modal opens
  useEffect(() => {
    if (show && currentUser) {
      form.setFieldsValue({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || ''
      });
    }
  }, [show, form, currentUser]);
  
  const handleFinish = async (values) => {
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      if (testResult === 'success') {
        notification.success(
          translations.success.title,
          translations.success.description
        );
        onClose();
      } else {
        notification.error(
          translations.error.title,
          translations.error.description
        );
      }
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleCancel = () => {
    // Check if form has been modified before closing
    const formValues = form.getFieldsValue();
    const isModified = 
      formValues.firstName !== (currentUser?.firstName || '') ||
      formValues.lastName !== (currentUser?.lastName || '') ||
      formValues.email !== (currentUser?.email || '');
      
    if (isModified) {
      if (window.confirm(translations.confirmCancel)) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  // Test functions to quickly show all notification types
  const showTestNotifications = (type) => {
    switch(type) {
      case 'success':
        // Try both your custom hook and direct API to see which works
        notification.success({
          message: 'Direct Success Title',
          description: 'Using direct notification API',
          placement: 'topRight',
        });
        notification.success({
          message: 'Success Title', 
          description: 'This is a success notification with theme support.'
        });
        break;
      case 'error':
        notification.error('Error Title', 'This is an error notification with theme support.');
        break;
      case 'warning':
        notification.warning('Warning Title', 'This is a warning notification with theme support.');
        break;
      case 'info':
        notification.info('Info Title', 'This is an info notification with theme support.');
        break;
      default:
        break;
    }
  };
  
  return (
    <Modal 
      show={show} 
      onClose={handleCancel}
      width="450px" 
      height="auto"
      mobileHeight="auto"
    >
      <ModalContent theme={theme}>
        <ModalTitle level={3} theme={theme}>{translations.title}</ModalTitle>
        
        {isSubmitting ? (
          <SpinContainer>
            <Spin size="large" />
          </SpinContainer>
        ) : (
          <FormContainer
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
            initialValues={{
              firstName: currentUser?.firstName || '',
              lastName: currentUser?.lastName || '',
              email: currentUser?.email || ''
            }}
          >
            <FormItem
              name="firstName"
              label={translations.firstName}
              required={false}
              rules={[
                { required: true, message: translations.validation.firstNameRequired }
              ]}
              theme={theme}
            >
              <Inputs 
                placeholder={translations.placeholders.firstName}
                autoComplete="given-name"
              />
            </FormItem>
            
            <FormItem
              name="lastName"
              label={translations.lastName}
              required={false}
              rules={[
                { required: true, message: translations.validation.lastNameRequired }
              ]}
              theme={theme}
            >
              <Inputs 
                placeholder={translations.placeholders.lastName}
                autoComplete="family-name"
              />
            </FormItem>
            
            <FormItem
              name="email"
              label={translations.email}
              required={false}
              rules={[
                { required: true, message: translations.validation.emailRequired },
                { type: 'email', message: translations.validation.emailValid }
              ]}
              theme={theme}
            >
              <Inputs 
                placeholder={translations.placeholders.email}
                autoComplete="email"
              />
            </FormItem>
            
            <ButtonContainer>
              <SecondaryButton 
                onClick={handleCancel}
                theme={theme}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </SecondaryButton>
              <MainButton 
                type="submit" 
                htmlType="submit"
                loading={isSubmitting}
              >
                {translations.saveButton}
              </MainButton>
            </ButtonContainer>
          </FormContainer>
        )}
        
      </ModalContent>
    </Modal>
  );
};

export default EditarMiPerfil;