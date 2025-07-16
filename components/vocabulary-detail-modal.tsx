"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Copy, Volume2, BookOpen, Tag, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VocabularyItem } from '@/lib/types';

interface VocabularyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary: VocabularyItem;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
}

const getPartOfSpeechColor = (partOfSpeech: string) => {
  switch (partOfSpeech.toLowerCase()) {
    case '名词':
    case 'noun':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
    case '动词':
    case 'verb':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800';
    case '形容词':
    case 'adjective':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    case '副词':
    case 'adverb':
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800';
    case '惯用语':
    case 'idiom':
      return 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export default function VocabularyDetailModal({
  isOpen,
  onClose,
  vocabulary,
  isBookmarked,
  onBookmark,
}: VocabularyDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the modal for keyboard navigation
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('已复制到剪贴板', {
        duration: 2000,
      });
    }).catch(() => {
      toast.error('复制失败', {
        duration: 2000,
      });
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-8 bg-black/50 backdrop-blur-sm dark:bg-black/70"
      onClick={handleBackdropClick}
    >
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3
            }}
            className="modal-content modal-rounded relative w-full max-w-2xl max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] min-h-[300px] bg-background shadow-2xl outline-none flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  词汇详情
                </h2>
                <Badge 
                  variant="outline" 
                  className={`text-xs sm:text-sm ${getPartOfSpeechColor(vocabulary.part_of_speech)}`}
                >
                  {vocabulary.part_of_speech}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBookmark(vocabulary._id)}
                  className={`${
                    isBookmarked 
                      ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300' 
                      : 'text-muted-foreground hover:text-yellow-500 dark:hover:text-yellow-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="modal-scroll flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
              <div className="space-y-6 pb-4">
                {/* Main Word Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Japanese Word */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">日语</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-2xl sm:text-3xl font-medium text-foreground japanese-text">
                            {vocabulary.japanese_word}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(vocabulary.japanese_word)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="hidden sm:inline">发音</span>
                      </Button>
                    </div>

                    <Separator />

                    {/* Reading */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">读音</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg text-foreground">
                          {vocabulary.reading}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(vocabulary.reading)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Chinese Meaning */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">中文意思</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg text-foreground">
                          {vocabulary.chinese_meaning}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(vocabulary.chinese_meaning)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>课程信息</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">课程</label>
                        <p className="text-foreground">{vocabulary.lesson_name}</p>
                      </div>
                      <div className="text-right">
                        <label className="text-sm font-medium text-muted-foreground">书籍ID</label>
                        <p className="text-foreground">{vocabulary.book_id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Example Sentences */}
                {vocabulary.example_sentences && vocabulary.example_sentences.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-5 h-5" />
                          <span>例句</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {vocabulary.example_sentences.length} 个
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {vocabulary.example_sentences.map((sentence, index) => (
                          <div 
                            key={index} 
                            className="p-3 bg-muted/50 rounded-lg space-y-2 border border-border"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">
                                例句 {index + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(sentence)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-foreground japanese-text">{sentence}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>其他信息</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground">词性</label>
                        <p className="text-foreground">{vocabulary.part_of_speech}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">例句数量</label>
                        <p className="text-foreground">{vocabulary.example_sentences?.length || 0} 个</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">课程ID</label>
                        <p className="text-foreground">{vocabulary.lesson_id}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">单词编号</label>
                        <p className="text-foreground">{vocabulary.word_number}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="modal-footer flex flex-col sm:flex-row gap-3 px-6 py-4 sm:px-8 sm:py-5 border-t border-border bg-muted/30 flex-shrink-0 items-center">
              {/* Mobile: All buttons stacked and centered */}
              <div className="flex flex-col gap-3 sm:hidden w-full max-w-sm">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => copyToClipboard(
                    `${vocabulary.japanese_word} (${vocabulary.reading}) - ${vocabulary.chinese_meaning}`
                  )}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制全部
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  播放发音
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full justify-center"
                >
                  关闭
                </Button>
              </div>
              
              {/* Desktop: Action buttons left, close button right, all vertically centered */}
              <div className="hidden sm:flex sm:w-full sm:justify-between sm:items-center">
                <div className="modal-actions flex gap-3 items-center">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center"
                    onClick={() => copyToClipboard(
                      `${vocabulary.japanese_word} (${vocabulary.reading}) - ${vocabulary.chinese_meaning}`
                    )}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制全部
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    播放发音
                  </Button>
                </div>
                
                <Button
                  onClick={onClose}
                  className="flex items-center justify-center"
                >
                  关闭
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
  );
}
