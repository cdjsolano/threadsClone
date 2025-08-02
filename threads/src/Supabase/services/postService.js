import { supabase } from '../../../supabaseClient';


export const fetchAllPosts = async () => {
  const { data, error } = await supabase
    .from('post')
    .select(`
      id,
      content,
      image_url,
      video_url,
      created_at,
      user_id (userName, avatarProfile)
    `)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error al traer posts:', error);
    return [];
  }

  return data;
};

export const createPost = async (newPost, userName) => {
  const { content, user_id, image_url, video_url } = newPost;
  
  const { data, error } = await supabase
    .from('post') 
    .insert([{ 
      content : newPost, 
      user_id: userName?.id,
      image_url, video_url }])
    .select(); // Esto devuelve el post recién creado

     if (error) {
    console.error('Error al crear post:', error.message);
    throw error;
  }
  console.log(newPost);
     const { err } = await supabase
    .from('threadUsers')
    .insert([{ 
      userName: userName.user_metadata.name,
      userEmail:  userName.user_metadata.email
       }])
    
     if (err) {
    console.error('Error al crear post:', error.message);
    throw error;
  }
 

  return data[0]; // Devuelve el nuevo post para mostrarlo
};


