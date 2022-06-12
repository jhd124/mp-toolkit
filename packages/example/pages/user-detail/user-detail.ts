import { chain } from "../../setup-mp-toolkit";

chain()
  .page({
    data: {
      name: '',
      avatar: '',
    },
    methods: {
      onLoad(){
        const { name, avatar } = this.$mpKit.stateStore.state.user
        this.setData({
          name,
          avatar,
        })
      },
      onTapChangeAvatar(){
        const imageSet = [
          "/images/cat-1.jpeg",
          "/images/cat-2.jpeg",
          "/images/cat-3.jpeg",
        ].filter(i => i !== this.data.avatar)
        const index = Math.floor(Math.random() * imageSet.length)
        this.setData({
          avatar: imageSet[index]
        })
      },
      onSubmit(e: {detail: {value: {name: string}}}){
        const {detail: {value: {name}}} = e
        this.$mpKit.stateStore.dispatch({
          user: {
            name,
            avatar: this.data.avatar
          }
        })
      },
    }
  })

  .create()