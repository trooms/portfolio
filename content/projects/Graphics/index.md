---
index: 8
type: project
title: 'Graphics Playground'
date: 'Present'
description: "Snippets from my Raytracer"
tools: 'OpenGL'
image: ./toy.jpg
---

Some source code for a raytracer I made.

Includes basic implementations of:
- Shadow ray phong shading
- Recursive reflections
- Soft shadows (deferred)
- Anti aliasing

```c++
struct ShadowBufferInfo
{
  float bufferWeight;
  float distance_to_occluder;
  float distance_to_light;
  float distance_to_camera;

  ShadowBufferInfo(float weight, float odist, float ldist, float cdist)
    : bufferWeight(weight), distance_to_occluder(odist), distance_to_light(ldist), distance_to_camera(cdist)
  {
  }

  ShadowBufferInfo& operator+=(const ShadowBufferInfo& rhs)
  {
    bufferWeight += rhs.bufferWeight;
    distance_to_occluder += rhs.distance_to_occluder;
    distance_to_light += rhs.distance_to_light;
    distance_to_camera += rhs.distance_to_camera;
    return *this;
  }

  ShadowBufferInfo& operator/=(const ShadowBufferInfo& rhs)
  {
    bufferWeight /= rhs.bufferWeight;
    distance_to_occluder /= rhs.distance_to_occluder;
    distance_to_light /= rhs.distance_to_light;
    distance_to_camera /= rhs.distance_to_camera;
    return *this;
  }

  ShadowBufferInfo& operator/=(float rhs)
  {
    bufferWeight /= rhs;
    distance_to_occluder /= rhs;
    distance_to_light /= rhs;
    distance_to_camera /= rhs;
    return *this;
  }
};

void plot_pixel_display(int x,int y,unsigned char r,unsigned char g,unsigned char b);
void plot_pixel_jpeg(int x,int y,unsigned char r,unsigned char g,unsigned char b);
void plot_pixel(int x,int y,unsigned char r,unsigned char g,unsigned char b);
std::pair<glm::vec3, ShadowBufferInfo> ray_trace(glm::vec3 camera_pos, glm::vec3 viewport_pos, size_t reflection_depth = 3);
glm::vec2 sphere_intersect(glm::vec3 origin, glm::vec3 direction, Sphere sphere);
std::pair<glm::vec3, ShadowBufferInfo> phong_illumination(glm::vec3 camera_position, glm::vec3 origin, glm::vec3 normal, glm::vec3 diffuse, glm::vec3 specular, float shininess);
void save_jpg();

glm::vec3 reflect_ray(glm::vec3 ray, glm::vec3 normal);

struct IntersectionInfo
{
  Triangle* triangle;
  float t;
  float u;
  float v;
};

bool is_nearly_zero(const glm::vec3& vector, float tolerance = EPSILON)
{
  return (glm::abs(vector.x) <= tolerance) &&
         (glm::abs(vector.y) <= tolerance) &&
         (glm::abs(vector.z) <= tolerance);
}
#define NUM_SAMPLES 8

float compute_soft_shadow(int pixel_x, int pixel_y, std::vector<std::vector<ShadowBufferInfo> >& shadowBuffer)
{
  ShadowBufferInfo* shadowInfo = &shadowBuffer[pixel_x][pixel_y];
  if (shadowInfo->bufferWeight >= 1.0f) return 1.0f;
  float occlusion = shadowInfo->distance_to_occluder / shadowInfo->distance_to_light;
  if (occlusion >= 1.0f) return 1.0f;

  float sample_size = (1.0f - occlusion) * SHADOW_RADIUS / shadowInfo->distance_to_camera;
  sample_size = glm::clamp(sample_size, 0.0f, 10.0f);
  sample_size *= 100;
  int sample_radius = static_cast<int>(sample_size);
  float D_Sample = sample_size;
  float D_max = sqrt(2.0f) * sample_size;

  for (int dy = -sample_radius; dy <= sample_radius; ++dy)
  {
    for (int dx = -sample_radius; dx <= sample_radius; ++dx)
    {
      int sample_x = pixel_x + dx;
      int sample_y = pixel_y + dy;

      if (sample_x < 0 || sample_x >= WIDTH || sample_y < 0 || sample_y >= HEIGHT)
        continue;

      ShadowBufferInfo* sample_shadowInfo = &shadowBuffer[sample_x][sample_y];
      float sample_occlusion = sample_shadowInfo->distance_to_occluder / sample_shadowInfo->distance_to_light;

      if (sample_occlusion >= 1.0f) {
        float distance_sq = static_cast<float>(dx * dx + dy * dy);
        if (distance_sq < D_Sample * D_Sample) {
          D_Sample = sqrt(distance_sq);
        }
      }
    }
  }

  float S_Shadow = D_Sample / D_max;
  S_Shadow = glm::clamp(S_Shadow, 0.0f, 1.0f);

  float final_occlusion = glm::mix(S_Shadow, shadowInfo->bufferWeight, 0.5f);
  return final_occlusion >= 1.0f ? 1.0f : final_occlusion;
}

void draw_scene()
{
  const double Vw = 2 * -FOCAL_LENGTH * tan(glm::radians(FOV) / 2.0);
  const double Vh = Vw * (static_cast<double>(HEIGHT) / WIDTH);
  const glm::vec3 camera_pos(0, 0, 0);

  // Super sampling anti-aliasing
  float jitterMatrix[NUM_SAMPLES * 2] = {
    1.0f/6.0f, 1.0f/6.0f,
    5.0f/6.0f, 1.0f/6.0f,
    1.0f/6.0f, 5.0f/6.0f,
    5.0f/6.0f, 5.0f/6.0f,
    3.0f/6.0f, 2.0f/6.0f,
    2.0f/6.0f, 4.0f/6.0f,
    4.0f/6.0f, 4.0f/6.0f,
    2.0f/6.0f, 2.0f/6.0f,
  };
  std::vector<std::vector<glm::vec3> > colorBuffer(WIDTH, std::vector<glm::vec3>(HEIGHT, glm::vec3(0.0f)));
  std::vector<std::vector<ShadowBufferInfo> > shadowBuffer(WIDTH, std::vector<ShadowBufferInfo>(HEIGHT, ShadowBufferInfo(0.0f, 0.0f, 0.0f, 0.0f)));
  for(unsigned int x=0; x<WIDTH; x++)
  {
    glPointSize(2.0);
    glBegin(GL_POINTS);
    for(unsigned int y=0; y<HEIGHT; y++)
    {
      glm::vec3 accumulated_color(0.0f);
      ShadowBufferInfo accumulated_shadow_info = ShadowBufferInfo(0.0f, 0.0f, 0.0f, 0.0f);
      for (int sample = 0; sample < NUM_SAMPLES; ++sample)
      {
        glm::vec3 viewport_pos(
            ((WIDTH / 2.0 - (x + jitterMatrix[2 * sample])) * (Vw / WIDTH)),
            -((y + jitterMatrix[2 * sample + 1]) - HEIGHT / 2.0) * (Vh / HEIGHT),
            -FOCAL_LENGTH
        );
        auto [color, shadow_info] = ray_trace(camera_pos, viewport_pos);

        accumulated_color += color;
        accumulated_shadow_info += shadow_info;
      }
      accumulated_color /= static_cast<float>(NUM_SAMPLES);
      accumulated_shadow_info /= static_cast<float>(NUM_SAMPLES);

      colorBuffer[x][y] = accumulated_color;
      shadowBuffer[x][y] = accumulated_shadow_info; // currently unused

      plot_pixel_display(x, y, accumulated_color.r, accumulated_color.g, accumulated_color.b);
      if (!SOFT_SHADOW_COND)
      {
        plot_pixel_jpeg(x, y, accumulated_color.r, accumulated_color.g, accumulated_color.b);
      }
    }
    glEnd();
    glFlush();
  }

  if (SOFT_SHADOW_COND)
  {
    for(unsigned int x = 0; x < WIDTH; x++)
    {
      glPointSize(2.0);
      glBegin(GL_POINTS);
      for(unsigned int y = 0; y < HEIGHT; y++)
      {
        glm::vec3 filtered_color = colorBuffer[x][y] * compute_soft_shadow(x, y, shadowBuffer);
        plot_pixel_display(x, y, filtered_color.r, filtered_color.g, filtered_color.b);
        plot_pixel_jpeg(x, y, filtered_color.r, filtered_color.g, filtered_color.b);
      }
      glEnd();
      glFlush();
    }
  }
  save_jpg();
  printf("Ray tracing completed.\n");
  fflush(stdout);
}

bool find_closest_sphere_intersection(
    const glm::vec3& camera_pos,
    const glm::vec3& ray_dir,
    Sphere*& closest_sphere,
    float& closest_intersection)
{
  closest_sphere = nullptr;
  closest_intersection = FLT_MAX;

  for (int i = 0; i < num_spheres; ++i)
  {
    const Sphere& sphere = spheres[i];
    glm::vec2 intersections = sphere_intersect(camera_pos, ray_dir, sphere);
    float intersect_min = glm::min(intersections[0], intersections[1]);

    if (intersect_min > 0 && intersect_min < closest_intersection)
    {
      closest_intersection = intersect_min;
      closest_sphere = const_cast<Sphere*>(&sphere);
    }
  }

  return closest_sphere != nullptr;
}

bool find_closest_triangle_intersection(
    const glm::vec3& camera_pos,
    const glm::vec3& ray_dir,
    IntersectionInfo& closest_intersection_info
    )
{
  closest_intersection_info.t = FLT_MAX;
  closest_intersection_info.triangle = nullptr;
  closest_intersection_info.u = 0.0f;
  closest_intersection_info.v = 0.0f;
  for (int i = 0; i < num_triangles; ++i)
  {
    const Triangle& triangle = triangles[i];
    glm::vec3 v0 = glm::vec3(triangle.v[0].position[0], triangle.v[0].position[1], triangle.v[0].position[2]);
    glm::vec3 v1 = glm::vec3(triangle.v[1].position[0], triangle.v[1].position[1], triangle.v[1].position[2]);
    glm::vec3 v2 = glm::vec3(triangle.v[2].position[0], triangle.v[2].position[1], triangle.v[2].position[2]);

    glm::vec3 edge1 = v1 - v0;
    glm::vec3 edge2 = v2 - v0;

    glm::vec3 h = glm::cross(ray_dir, edge2);
    float a = glm::dot(edge1, h);

    if (fabs(a) < EPSILON)
      continue; // Ray is parallel to the triangle.

    float f = 1.0f / a;
    glm::vec3 s = camera_pos - v0;
    float u = f * glm::dot(s, h);

    if (u < 0.0f || u > 1.0f)
      continue;

    glm::vec3 q = glm::cross(s, edge1);
    float v = f * glm::dot(ray_dir, q);

    if (v < 0.0f || u + v > 1.0f)
      continue;

    float t = f * glm::dot(edge2, q);

    if (t > EPSILON && t < closest_intersection_info.t)
    {
      closest_intersection_info.t = t;
      closest_intersection_info.triangle = const_cast<Triangle*>(&triangle);
      closest_intersection_info.u = u;
      closest_intersection_info.v = v;
    }
  }

  return closest_intersection_info.triangle != nullptr;
}

float get_closest_intersection_dist(glm::vec3 origin, glm::vec3 dir)
{
  Sphere* closest_sphere = nullptr;
  float closest_sphere_intersection;

  const bool sphere_hit = find_closest_sphere_intersection(origin, dir, closest_sphere, closest_sphere_intersection);

  IntersectionInfo closest_triangle_info;
  const bool triangle_hit = find_closest_triangle_intersection(origin, dir, closest_triangle_info);

  return std::min(closest_sphere_intersection, closest_triangle_info.t);
}

std::pair<glm::vec3, ShadowBufferInfo> ray_trace(glm::vec3 camera_pos, glm::vec3 viewport_pos, size_t reflection_depth)
{
    glm::vec3 ray_dir = glm::normalize(viewport_pos - camera_pos);

    Sphere* closest_sphere = nullptr;
    float closest_sphere_intersection;

    const bool sphere_hit = find_closest_sphere_intersection(camera_pos, ray_dir, closest_sphere, closest_sphere_intersection);

    IntersectionInfo closest_triangle_info;
    const bool triangle_hit = find_closest_triangle_intersection(camera_pos, ray_dir, closest_triangle_info);
    if (!sphere_hit && !triangle_hit)
    {
        return std::make_pair(BACKGROUND_COLOR, ShadowBufferInfo(1.0f, 0.0, 0.0, 0.0)); // No shadow
    }

    // Initialize variables to hold intersection details
    glm::vec3 intersection_pos;
    glm::vec3 normal;
    glm::vec3 specular;
    glm::vec3 local_color;
    ShadowBufferInfo shadow_factor = ShadowBufferInfo(1.0f, 0.0f, 0.0f, 0.0f);

    if (triangle_hit && (!sphere_hit || closest_triangle_info.t < closest_sphere_intersection))
    {
        // Triangle intersection is closer
        intersection_pos = camera_pos + closest_triangle_info.t * ray_dir;

        // Barycentric coordinates
        float u = closest_triangle_info.u;
        float v = closest_triangle_info.v;
        float w = 1.0f - u - v;

        Triangle* hit_triangle = closest_triangle_info.triangle;

        // Interpolate normals
        glm::vec3 normal0 = glm::normalize(glm::vec3(hit_triangle->v[0].normal[0], hit_triangle->v[0].normal[1], hit_triangle->v[0].normal[2]));
        glm::vec3 normal1 = glm::normalize(glm::vec3(hit_triangle->v[1].normal[0], hit_triangle->v[1].normal[1], hit_triangle->v[1].normal[2]));
        glm::vec3 normal2 = glm::normalize(glm::vec3(hit_triangle->v[2].normal[0], hit_triangle->v[2].normal[1], hit_triangle->v[2].normal[2]));

        glm::vec3 interpolated_normal = w * normal0 + u * normal1 + v * normal2;
        normal = glm::normalize(interpolated_normal);

        // Interpolate diffuse color
        glm::vec3 diffuse0 = glm::vec3(hit_triangle->v[0].color_diffuse[0], hit_triangle->v[0].color_diffuse[1], hit_triangle->v[0].color_diffuse[2]);
        glm::vec3 diffuse1 = glm::vec3(hit_triangle->v[1].color_diffuse[0], hit_triangle->v[1].color_diffuse[1], hit_triangle->v[1].color_diffuse[2]);
        glm::vec3 diffuse2 = glm::vec3(hit_triangle->v[2].color_diffuse[0], hit_triangle->v[2].color_diffuse[1], hit_triangle->v[2].color_diffuse[2]);

        glm::vec3 interpolated_diffuse = w * diffuse0 + u * diffuse1 + v * diffuse2;

        // Interpolate specular color
        glm::vec3 specular0 = glm::vec3(hit_triangle->v[0].color_specular[0], hit_triangle->v[0].color_specular[1], hit_triangle->v[0].color_specular[2]);
        glm::vec3 specular1 = glm::vec3(hit_triangle->v[1].color_specular[0], hit_triangle->v[1].color_specular[1], hit_triangle->v[1].color_specular[2]);
        glm::vec3 specular2 = glm::vec3(hit_triangle->v[2].color_specular[0], hit_triangle->v[2].color_specular[1], hit_triangle->v[2].color_specular[2]);

        glm::vec3 interpolated_specular = w * specular0 + u * specular1 + v * specular2;

        // Interpolate shininess
        double shininess0 = hit_triangle->v[0].shininess;
        double shininess1 = hit_triangle->v[1].shininess;
        double shininess2 = hit_triangle->v[2].shininess;

        specular = interpolated_specular;

        // Compute local color and shadow factor using Phong illumination
        std::pair<glm::vec3, ShadowBufferInfo> phong_result = phong_illumination(
            camera_pos,
            intersection_pos,
            normal,
            interpolated_diffuse,
            interpolated_specular,
            static_cast<float>(w * shininess0 + u * shininess1 + v * shininess2)
        );

        local_color = phong_result.first;
        shadow_factor = phong_result.second;
    }
    else if (sphere_hit)
    {
        // Sphere intersection
        intersection_pos = camera_pos + closest_sphere_intersection * ray_dir;
        normal = glm::normalize(intersection_pos - glm::vec3(closest_sphere->position[0], closest_sphere->position[1], closest_sphere->position[2]));
        specular = glm::vec3(closest_sphere->color_specular[0], closest_sphere->color_specular[1], closest_sphere->color_specular[2]);

        // Compute local color and shadow factor using Phong illumination
        std::pair<glm::vec3, ShadowBufferInfo> phong_result = phong_illumination(
            camera_pos,
            intersection_pos,
            normal,
            glm::vec3(closest_sphere->color_diffuse[0], closest_sphere->color_diffuse[1], closest_sphere->color_diffuse[2]),
            specular,
            closest_sphere->shininess
        );

        local_color = phong_result.first;
        shadow_factor = phong_result.second;
    }

    // Turn off reflection
    if (!REFLECTIONS)
    {
      specular = glm::vec3(0.0f);
    }

    // Mirror reflection
    if (reflection_depth == 0 || glm::length(specular) == 0.0f)
    {
        return std::make_pair(local_color, shadow_factor);
    }

    glm::vec3 reflected_dir = reflect_ray(-ray_dir, normal);
    glm::vec3 reflected_viewport_pos = intersection_pos + reflected_dir;
    std::pair<glm::vec3, ShadowBufferInfo> reflected_result = ray_trace(intersection_pos, reflected_viewport_pos, reflection_depth - 1);
    glm::vec3 reflected_color = reflected_result.first;
    ShadowBufferInfo reflected_shadow = reflected_result.second;

    if (reflected_color == BACKGROUND_COLOR)
    {
        reflected_color = local_color;
    }

    glm::vec3 final_color = (1.0f - specular) * local_color + specular * reflected_color;
    return std::make_pair(final_color, shadow_factor);
}

glm::vec3 reflect_ray(glm::vec3 ray, glm::vec3 normal)
{
  return 2.0f * normal * glm::dot(ray, normal) - ray;
}

glm::vec2 normalizeOffset(const glm::vec2& offset, float radius) {
  if (glm::length(offset) == 0.0f)
    return offset;
  return (offset / glm::length(offset)) * radius;
}

float halton(int index, int base)
{
  float f = 1.0f, r = 0.0f;
  while (index > 0)
  {
    f = f / base;
    r = r + f * (index % base);
    index = index / base;
  }
  return r;
}

std::vector<glm::vec2> generate_shadow_offsets(int samples, float radius)
{
  std::vector<glm::vec2> offsets;
  for(int i = 1; i <= samples; ++i)
  {
    float x = halton(i, 2) * 2.0f - 1.0f;
    float y = halton(i, 3) * 2.0f - 1.0f;
    glm::vec2 offset(x, y);
    if(glm::length(offset) <= 1.0f)
      offsets.emplace_back(glm::normalize(offset) * radius);
    else
      offsets.emplace_back(glm::vec2(0.0f));
  }
  return offsets;
}

#define SHADOW_SAMPLES (8)

float compute_weight(const glm::vec2& offset, float sigma = 0.5f)
{
  float distance = glm::length(offset);
  return std::exp(-(distance * distance) / (2.0f * sigma * sigma));
}

std::pair<glm::vec3, ShadowBufferInfo> phong_illumination(
    glm::vec3 camera_position,
    glm::vec3 origin,
    glm::vec3 normal,
    glm::vec3 diffuse,
    glm::vec3 specular,
    float shininess)
{
    glm::vec3 intensity = AMBIENT_COLOR;
    std::vector<glm::vec2> offsets = generate_shadow_offsets(SHADOW_SAMPLES, SHADOW_RADIUS);
    ShadowBufferInfo shadow_buffer_info = ShadowBufferInfo(0.0f, 0.0f, 0.0f, 0.0f);
    for (int i = 0; i < num_lights; ++i)
    {
        Light& light = lights[i];
        glm::vec3 light_pos = glm::vec3(light.position[0], light.position[1], light.position[2]);
        glm::vec3 light_dir = normalize(light_pos - origin);

        glm::vec3 eye_dir = normalize(camera_position - origin);
        glm::vec3 reflect_dir = glm::reflect(-light_dir, normal);

        glm::vec3 shadow_origin = origin + EPSILON * normal;
        float total_weight = 0.0f;
        float unoccluded_weight = 0.0f;
        float total_distance_to_occluder = 0.0f;
        for (auto& offset : offsets)
        {
            float weight = compute_weight(offset, 0.5f);
            glm::vec2 scaled_offset = normalizeOffset(offset, SHADOW_RADIUS);

            glm::vec3 light_sample_pos = light_pos + glm::vec3(scaled_offset, 0.0f);
            glm::vec3 offset_dir = glm::normalize(light_sample_pos - shadow_origin);

            float closest_intersection = get_closest_intersection_dist(shadow_origin, offset_dir);
            float light_distance = glm::length(light_pos - origin);

            total_weight += weight;
            shadow_buffer_info.distance_to_light += light_distance;
            total_distance_to_occluder += closest_intersection;
            if (closest_intersection < light_distance)
            {
                shadow_buffer_info.distance_to_occluder += closest_intersection;
                continue;
            }
            unoccluded_weight += weight;
        }
        if (!SOFT_SHADOW_COND)
        {
          float closest_intersection = get_closest_intersection_dist(shadow_origin, light_dir);
          float light_distance = glm::length(light_pos - origin);
          if (closest_intersection < light_distance) {
            continue;
          }
        } else
        {
          shadow_buffer_info.distance_to_light /= total_weight;
          shadow_buffer_info.distance_to_occluder /= total_weight;
          shadow_buffer_info.bufferWeight += (unoccluded_weight/total_weight);
        }

        float d = std::max(glm::dot(light_dir, normal), 0.0f);
        float s = std::max(glm::dot(glm::normalize(reflect_dir), eye_dir), 0.0f);

        glm::vec3 light_color = glm::vec3(light.color[0], light.color[1], light.color[2]);

        intensity += light_color * (diffuse * d + specular * std::pow(s, shininess));
    }
    intensity = glm::min(intensity, glm::vec3(1.0f));

    // Compute average shadow factor across all lights
    shadow_buffer_info.bufferWeight = shadow_buffer_info.bufferWeight / static_cast<float>(num_lights);
    shadow_buffer_info.distance_to_camera = glm::distance(origin, camera_position);
    shadow_buffer_info.distance_to_light = shadow_buffer_info.distance_to_light / static_cast<float>(num_lights);
    shadow_buffer_info.distance_to_occluder = shadow_buffer_info.distance_to_occluder / static_cast<float>(num_lights);

    return std::make_pair(255.0f * intensity, shadow_buffer_info);
}


glm::vec2 sphere_intersect(glm::vec3 origin, glm::vec3 direction, Sphere sphere)
{
  glm::vec3 origin_to_sphere = origin - glm::vec3(sphere.position[0], sphere.position[1], sphere.position[2]);
  double a = glm::dot(direction, direction);
  double b = 2 * glm::dot(origin_to_sphere, direction);
  double c = glm::dot(origin_to_sphere, origin_to_sphere) - sphere.radius*sphere.radius;

  double discriminant = b*b - 4*a*c;
  if (discriminant < 0) {
    return glm::vec2(0);
  }
  double first_intersect = (-b + sqrt(discriminant)) / (2*a);
  double second_intersect = (-b - sqrt(discriminant)) / (2*a);
  return glm::vec2(first_intersect, second_intersect);
}
```