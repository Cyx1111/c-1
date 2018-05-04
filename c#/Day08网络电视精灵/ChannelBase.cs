using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;


namespace Day08网络电视精灵
{
    public abstract  class ChannelBase
    {
        #region 属性

      
        /// <summary>
        /// 频道名称
        /// </summary>
        private string channelName;
        public string ChannelName
        {
            get { return channelName; }
            set { channelName = value; }
        }
        /// <summary>
        /// 频道路径
        /// </summary>
        private string path;
        public string Path
        {
            get { return path; }
            set { path = value; }
        }
        /// <summary>
        /// 节目列表
        /// </summary>
        private List<TvProgram> programList;
        public List< TvProgram> ProgramList
        {
            get { return programList; }
            set { this.programList = value; }
        }
     #endregion

        public abstract void Fetch();
        
    }
}
