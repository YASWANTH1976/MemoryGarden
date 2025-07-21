import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, FileText, Image, X } from 'lucide-react';
import { Memory } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportOptionsProps {
  memories: Memory[];
  onClose: () => void;
}

export function ExportOptions({ memories, onClose }: ExportOptionsProps) {
  const exportAsJSON = () => {
    const dataStr = JSON.stringify(memories, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `memory-garden-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAsPDF = async () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    
    pdf.setFontSize(20);
    pdf.text('My Memory Garden', 20, yPosition);
    yPosition += 20;
    
    pdf.setFontSize(12);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 20;
    
    memories.forEach((memory, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.text(`${index + 1}. ${memory.title}`, 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Location: ${memory.location}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`Date: ${memory.date}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`Emotion: ${memory.emotion}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`Mood: ${memory.mood}/10`, 25, yPosition);
      yPosition += 10;
      
      const splitDescription = pdf.splitTextToSize(memory.description, 160);
      pdf.text(splitDescription, 25, yPosition);
      yPosition += splitDescription.length * 5 + 10;
    });
    
    pdf.save(`memory-garden-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const shareGarden = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Memory Garden',
          text: `I've been growing my memories in a digital garden! I have ${memories.length} beautiful memories planted.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I've been growing my memories in a digital garden! I have ${memories.length} beautiful memories planted. Check it out!`;
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  const exportAsImage = async () => {
    const gardenElement = document.querySelector('.memory-grid');
    if (gardenElement) {
      const canvas = await html2canvas(gardenElement as HTMLElement);
      const link = document.createElement('a');
      link.download = `memory-garden-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Export Your Garden</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAsJSON}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 mr-3 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Export as JSON</div>
              <div className="text-sm text-gray-600">Download your memories as data</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAsPDF}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 mr-3 text-red-600" />
            <div className="text-left">
              <div className="font-medium">Export as PDF</div>
              <div className="text-sm text-gray-600">Create a printable memory book</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAsImage}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image className="w-5 h-5 mr-3 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Export as Image</div>
              <div className="text-sm text-gray-600">Save your garden as a picture</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareGarden}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-3 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Share Garden</div>
              <div className="text-sm text-gray-600">Tell others about your memories</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}