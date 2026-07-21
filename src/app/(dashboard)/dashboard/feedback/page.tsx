import React from 'react'
import Comment from '@/components/comment/Comment'
import { createClient } from '@/lib/supabase/server'

type Props = {}

 const BarPage = async(props: Props) => {
  const supabase = await createClient()
  const { data: { publicUrl } } = supabase.storage
  .from('websiteBucket')
  .getPublicUrl(`websiteBg/feedback.webp`)


  return (
  <div 
    className='min-h-screen flow-root relative overflow-hidden pb-15' 
    style={{backgroundImage:`url(${publicUrl})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
  >
    {/* 多层毛玻璃遮罩 */}
    <div className='absolute inset-0 backdrop-blur-md bg-black/40' />
    <div className='absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40' />
    
    {/* 内容区域 */}
    <div className='relative z-9 flex-1 mx-3 min-h-screen flex flex-col items-center justify-start pt-12'>
      {/* 标题卡片 - 带背景泛光 */}
      <div className='text-center mb-8'>
        <div className='relative inline-block'>
          {/* 外发光光晕 */}
          <div className='
            absolute -inset-8 
            bg-linear-to-r from-white/0 via-white/10 to-white/0 
            blur-3xl
            rounded-full'/>
          
          <h1 className='
            relative
            text-5xl md:text-6xl lg:text-7xl 
            font-extrabold 
            text-white
            drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]
            tracking-wider
            animate-pulse
            [text-shadow:0_0_30px_rgba(255,255,255,0.5),0_0_60px_rgba(255,255,255,0.2)]
          '>
            反馈信箱
          </h1>
        </div>
        
        {/* 装饰性元素 */}
        <div className='flex items-center justify-center gap-4 mt-4'>
          <div className='h-px w-12 bg-linear-to-r from-transparent to-white/40' />
          <div className='w-2 h-2 rounded-full bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.5)]' />
          <div className='h-px w-12 bg-linear-to-l from-transparent to-white/40' />
        </div>
        
        {/* 副标题 */}
        <p className='mt-3 text-white/60 text-sm md:text-base font-light tracking-wide drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]'>
          感谢您的建议与反馈
        </p>
      </div>
      
      {/* 评论组件 - 添加半透明背景 */}
      <div className='w-full max-w-3xl'>
        <div className='backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10 shadow-2xl'>
          <Comment name='' targetId='feedback' targetType='post'/>
        </div>
      </div>
    </div>
  </div>
)
}

export default BarPage