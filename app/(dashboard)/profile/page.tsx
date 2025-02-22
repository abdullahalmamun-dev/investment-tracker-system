'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';

interface FormData {
  name: string;
  email: string;
  profilePicture: FileList;
}

interface Profile {
  name: string;
  email: string;
  profilePicture: string;
}

const ProfilePage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:5000' // Add this
  });
  

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get<Profile>('/api/profile');
        setProfile(data);
        reset(data);
        setPreview(data.profilePicture);
      } catch (error) {
        console.error('Loading failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    
    if (data.profilePicture[0]) {
      formData.append('profilePicture', data.profilePicture[0]);
    }

    try {
      const { data: updated } = await api.put<Profile>('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfile(updated);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed. Please check console for details.');
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-white">Profile Management</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="shrink-0">
            {preview && (
              <Image
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                src={preview}
                alt="Profile preview"
                loader={({ src }) => src}
              />
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-2">
              Profile Image
              <input
                type="file"
                {...register('profilePicture')}
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Full Name
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="px-2 mt-1 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="mt-1 text-sm text-red-600">{message}</p>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white  mb-1">
              Email Address
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value:  /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address'
                  }
                })} 
                className="px-2 py-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className="mt-1 text-sm text-red-600">{message}</p>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
