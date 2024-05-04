'use client'

import axiosInstance from '@/axios';
import useFetch from '@/hooks/useFetch';
import React, { useState, useEffect } from 'react';

function Certificate({ bgImage, width, height, scale = 1, bgSize = 'contain', assets, mappingData = {} }) {
  
  
    const {data: base64Image, isFetching} = useFetch({method: 'post', url: '/convert/img-base64', dependencies: [bgImage], body: {url: bgImage}})


if(isFetching) return <div style={{ width: width, height: height, objectFit: bgSize, pointerEvents: 'none' }} className='shimmer bg-neutral-900 animate-pulse m-auto shadow-lg'></div>
  
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        scale: scale,
      }}
      id='certificate'
      className="bg-gray-700 w-full h-full m-auto shadow-lg"
    >
      {base64Image && !isFetching && (
        <img
          src={base64Image}
          alt="Background Image"
          width={width}
          height={height}
          style={{ width: '100%', height: '100%', objectFit: bgSize, pointerEvents: 'none' }}
        />
      )}
      {assets?.map((asset) => (
        <Asset
          key={asset.id}
          asset={asset}
          mappingData={mappingData}
        />
      ))}
    </div>
  );
}

const Asset = ({ asset, mappingData }) => {
  const Component = asset.component;
  return (
    <Component
      draggable={false}
      id={asset.id}
      className={`absolute z-[1] hover:cursor-move border-[2px] border-transparent`}
      style={{
        top: `${asset.top}px`,
        left: `${asset.left}px`,
        width: `${asset.width}px`,
        height: `${asset.height}px`,
        background: `${asset.background}`,
        borderRadius: `${asset.borderRadius}px`,
        textAlign: `${asset.textAlign}`,
        color: `${asset.color}`,
        fontSize: `${asset.fontSize}px`,
        fontWeight: `${asset.fontWeight}`,
        fontFamily: `${asset.fontFamily}`,
        textDecoration: `${asset.textDecoration}`,
        objectFit: "contain",
      }}
      src={asset?.src}
    >
      {replacePlaceholders(asset.value, mappingData)}
    </Component>
  );
};

function replacePlaceholders(template, values) {
  const regex = /{([^}]+)}/g;
  const replacedString = template?.replace(regex, (match, key) => {
    return values?.[key] || match;
  });
  if (replacedString === template) {
    return template;
  }
  return replacedString;
}

export default Certificate;
