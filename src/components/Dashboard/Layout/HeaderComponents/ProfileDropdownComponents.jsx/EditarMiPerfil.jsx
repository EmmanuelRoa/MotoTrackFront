import React, { useState, useEffect } from 'react';
import Modal from '../../../CommonComponts/Modals';
import Inputs from '../../../CommonComponts/Inputs';
import MainButton from '../../../CommonComponts/MainButton';
import SecondaryButton from '../../../CommonComponts/SecondaryButton';
import { useNotification } from '../../../CommonComponts/ToastNotifications';
import styled from 'styled-components';
import { Typography, Form, Spin, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useTheme } from '../../../../../context/ThemeContext';
import { useAuth } from '../../../../../context/AuthContext';
import { useLanguage } from '../../../../../context/LanguageContext';
import { profileEditTranslations } from '../../../../../utils/Modals/EditarMiPerfil';
import axios from 'axios';
import ReactDom from 'react-dom';

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

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  
  .ant-upload-wrapper.ant-upload-picture-circle-wrapper .ant-upload.ant-upload-select {
    margin: 0;
    width: 100px !important;
    height: 100px !important;
    border: 2px solid ${({ theme }) => theme.token.colorPrimary};
  }
  
  .avatar-text {
    margin-top: 10px;
    font-size: 14px;
    color: ${({ theme }) => theme.token.subtitleBlack};
  }
`;

const AvatarInitials = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 32px;
  font-weight: 500;
  color: ${({ theme }) => theme.token.titleColor};
  background-color: ${({ theme }) => 
    theme.currentTheme === 'themeDark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.03)'
  };
`;

const EditarMiPerfil = ({ show, onClose }) => {
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser, getAccessToken, fetchUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();
  const translations = profileEditTranslations[language];
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Reset and populate form when modal opens
  useEffect(() => {
    if (show && currentUser) {
      form.setFieldsValue({
        firstName: currentUser?.nombres || '',
        lastName: currentUser?.apellidos || '',
        email: currentUser?.correo || ''
      });
      
      // Set profile image if exists
      if (currentUser?.ftPerfil) {
        setImageUrl(currentUser.ftPerfil);
      } else {
        setImageUrl('');
      }
    }
  }, [show, form, currentUser]);
  
  // Convert file to base64 for preview
  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  };
  
  // Validate file before upload
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(translations.photoUpload?.typeError || 'Solo puedes subir imágenes JPG o PNG');
      return false;
    }
    const isLt8M = file.size / 1024 / 1024 < 8;
    if (!isLt8M) {
      message.error(translations.photoUpload?.sizeError || 'La imagen debe ser menor a 8MB');
      return false;
    }
    return true;
  };
  
  // Handle image change
  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      // In a real app, you would use the response URL
      // Here we're using FileReader for demo purposes
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        // Add profile image to form values
        form.setFieldsValue({
          ...form.getFieldsValue(),
          profileImage: url
        });
      });
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(translations.photoUpload?.uploadError || 'Error al subir la imagen');
    }
  };
  
  const handleFinish = async (values) => {
    setIsSubmitting(true);

    // Check which fields have been modified
    const modifiedFields = {};
    if (values.firstName !== (currentUser?.nombres || '')) {
      modifiedFields.nombres = values.firstName;
    }
    if (values.lastName !== (currentUser?.apellidos || '')) {
      modifiedFields.apellidos = values.lastName;
    }
    if (values.email !== (currentUser?.correo || '')) {
      modifiedFields.correo = values.email;
    }
    if (imageUrl !== (currentUser?.ftPerfil || '')) {
      modifiedFields.ftPerfil = imageUrl;
    }

    // If no fields were modified, close the modal
    if (Object.keys(modifiedFields).length === 0) {
      onClose();
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/profile`,
        modifiedFields,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      if (response?.data?.success === false) {
        throw new Error(translations.error.description || 'Error al actualizar el perfil');
      }
    
      const updatedUser = response?.data?.data;
      
      notification.success(
        translations.success.title,
        translations.success.response?.data?.message || translations.success.description
      );

      await fetchUser(); // Refresh user data
      onClose();
    } catch (error) {
      notification.error(
        translations.error.title || 'Error',
        error.message || translations.error.description
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    // Check if form has been modified before closing
    const formValues = form.getFieldsValue();
    const isModified = 
      formValues.nombres !== (currentUser?.nombres || '') ||
      formValues.apellidos !== (currentUser?.apellidos || '') ||
      formValues.correo !== (currentUser?.correo || '') ||
      imageUrl !== (currentUser?.ftPerfil || '');
      
    if (isModified) {
      if (window.confirm(translations.confirmCancel)) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  // Upload button content
  const uploadButton = (
    <>
      {loading ? <LoadingOutlined /> : 
        <AvatarInitials theme={theme}>
          {currentUser?.firstName?.charAt(0) || ''}
          {currentUser?.lastName?.charAt(0) || ''}
        </AvatarInitials>
      }
    </>
  );
  
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
              email: currentUser?.email || '',
              profileImage: currentUser?.profileImage || ''
            }}
          >
            {/* Profile Image Upload */}
            <ProfileImageContainer theme={theme}>
              <Form.Item
                name="profileImage"
                valuePropName="file"
                style={{ marginBottom: 0 }}
              >
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={beforeUpload}
                  onChange={handleImageChange}
                  accept=".jpg,.jpeg,.png"
                >
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="avatar" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '50%' 
                      }} 
                    />
                  ) : uploadButton}
                </Upload>
              </Form.Item>
              <div className="avatar-text">
                {translations.photoUpload?.text || 'Foto de perfil'}
              </div>
            </ProfileImageContainer>
            
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